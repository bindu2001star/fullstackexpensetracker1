const Expense = require("../model/userexpense");
const auth = require("../middleware/Auth");
const user = require("../model/user");

async function addexpense(req, res) {
  try {
    const { amount, description, category } = req.body;
    console.log("reqqqquesst", req.user.id);
    const expenses = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.id,
    })

      .then((expense) => {
        return res.status(200).json({ expense, success: true });
      })
      .catch((error) => {
        return res.status(403).json({ success: false, error: err });
      });
  } catch (err) {
    console.log(err);
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

    const data = await Expense.findAll({ where: { userId: userId } })
   
    .then((expenses) => {
      console.log(JSON.stringify({ expenses }));
      return res.status(200).json({ success: true, expenses });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;
    const dltexpense = await Expense.destroy({ where: { id: expenseId,userId:req.user.id } })
      .then((expense) => {
        console.log("deleted the expensesswsss")
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
