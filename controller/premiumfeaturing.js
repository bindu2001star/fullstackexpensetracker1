const User = require("../model/user");
const Expense = require("../model/userexpense");
const sequelize = require("../util/database");
const Sequelize = require("../util/database");
const premiumfeatures = async (req, res, next) => {
  try {
    const leaderboardofusers= await User.findAll({
       
        attributes: [
          'id','name'
          [sequelize.fn('sum', sequelize.col('amount')), 'total_cost'],
        ],
        includes:[{
            model:Expense,
            attributes:[]

        }],
        group: ['user.id'],
    })
    return res.status(200).json(leaderboardofusers)
    // const expenses = await Expense.findAll({
    //   //attributes:['userId','amount']
    //  // attributes: [
    //   //  "userId",
    //    // [sequelize.fn("sum", sequelize.col("amount")), "total_cost"],
    //  // ],
    //  // group: ["userId"],
    // });
  
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

module.exports = {
  premiumfeatures: premiumfeatures,
};
