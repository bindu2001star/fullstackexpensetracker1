const Expense = require("../model/userexpense");
const auth = require("../middleware/Auth");
const User = require("../model/user");
const { where } = require("sequelize");
const sequelize=require('../util/database');

async function addexpense(req, res) {
   const t= await sequelize.transaction();
   const userId = req.user.id;
   const { amount, description, category } = req.body;
   console.log("reqqqquesst", req.user.id);
   let new_total=0;
  try {
    const expenses = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.id,
    },{transaction:t});
    // const totalExpense = await Expense.sum("amount", { where: { userId } });
    // const total1=parseInt(totalExpense)+parseInt(amount);
   let existUser=await User.findOne({where:{id:userId}})
   let old_total=parseInt(existUser.totalexpense);
   new_total=parseInt((old_total*1)+(amount*1))
    await User.update({ totalexpense: new_total }, { where: {id: userId },transaction:t}).then(async()=>{
      await t.commit();
      res.status(200).json({ message: "Expense created successfully", expenses });
    })
  } catch (error) {
    await t.rollback();
    return res.status(403).json({ success: false, error: error });
  }
}
async function getExpenses(req, res) {
  // try {
  //     const userId = req.users.id;
  //     console.log(userId, 'userid...');
  //     //{where:{userId:req.users.id}}
  //     const expensess = await Expense.findAll({where:{userId:userId}})
  //         .then(expenses => {
  //             console.log(JSON.stringify({ expenses }));
  //             return res.status(200).json({ success: true, expenses })
  //         })
  //         .catch(err => {
  //             console.log(err)
  //             return res.status(500).json({ success: false, error: err })
  //         })
  // } catch (err) {
  //     console.log(err);
  // }
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
    const dltexpense = await Expense.destroy({
      where: { id: expenseId, userId: req.user.id },
    })
      .then((expense) => {
        console.log("deleted the expensesswsss");
        return res.status(200).json({ success: true, expense });
      })
      .catch((error) => {
        return res.status(404).send({ message: "something went wrong" });
      });
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  addexpense: addexpense,
  getExpenses: getExpenses,
  deleteExpense: deleteExpense,
};
