const Expense = require("../model/userexpense");
const auth = require("../middleware/Auth");
const User = require("../model/user");
const { where } = require("sequelize");
const sequelize = require("../util/database");
const UserService=require('../services/userService');
const s3=require('../services/s3');
const DownloadReport=require('../model/downloadreport');


async function addexpense(req, res) {
  const t = await sequelize.transaction();
  const userId = req.user.id;
  const { amount, description, category } = req.body;
  console.log("reqqqquesst", req.user.id);
  let new_total = 0;
  try {
    const expenses = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
      },
      { transaction: t }
    );
    // const totalExpense = await Expense.sum("amount", { where: { userId } });
    // const total1=parseInt(totalExpense)+parseInt(amount);
    let existUser = await User.findOne({ where: { id: userId } });

    let old_total = parseInt(existUser.totalexpense);
    //console.log(old_total,"olllllllllllllllllllllddddddddd");
    if (isNaN(old_total)) {
      old_total = 0;
    }
    new_total = parseInt(old_total * 1 + amount * 1);
    await User.update(
      { totalexpense: new_total },
      { where: { id: userId }, transaction: t }
    ).then(async () => {
      await t.commit();
      res
        .status(200)
        .json({ message: "Expense created successfully", expenses });
    });
  } catch (error) {
    await t.rollback();
    return res.status(403).json({ success: false, error: error });
  }
}
async function getExpenses(req, res) {
  try {
    const userId = req.user.id;
    console.log("USERId: ", userId);

    const data = await Expense.findAll({ where: { userId: userId } }).then(
      (expenses) => {
        console.log(JSON.stringify({ expenses }));
        return res.status(200).json({ success: true, expenses });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;

    // Retrieve the expense that is going to be deleted
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).send({ message: "Expense not found" });
    }
    // Delete the expense from the database
    await Expense.destroy({ where: { id: expenseId } });
    const userId = req.user.id;
    // Recalculate the total expense for the user
    const totalExpense = await Expense.sum("amount", { where: { userId } });

    // Update the totalexpense field in the users table
    await User.update(
      { totalexpense: totalExpense },
      { where: { id: userId } }
    );

    res.send({ message: "Expense deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error deleting expense." });
  }
}

const downloadReport = async (req, res, next) => {
  try{
    if(req.user.ispremiumuser===true){
      const expenses = await UserService.getExpenses(req);
      console.log("expensesssssss",expenses);
      const stringifiedExpenses = JSON.stringify(expenses);
      const userId=req.user.id;
      const filename = `Expense${userId}/${new Date()}.txt`;
      const bufferData=Buffer.from(stringifiedExpenses,'utf-8');
      console.log(filename,"FILENAME");
      const fileURL = await s3.uploadToS3(bufferData,filename);
      await DownloadReport.create({
        userId:userId,
        URL:fileURL
      })
      res.status(200).json({ fileURL, success: true });

    }else{
      res.status(403).json({message:'Only Premium Users can download the report.'})
    }
  }catch(err){
    console.log("error while downloading ",err.message)

  }
 
};
module.exports = {
  addexpense: addexpense,
  getExpenses: getExpenses,
  deleteExpense: deleteExpense,
  downloadReport: downloadReport,
};
