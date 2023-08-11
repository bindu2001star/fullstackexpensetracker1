const User = require("../model/user");
const Expense = require("../model/userexpense");
//const sequelize = require("../util/database");
const sequelize = require("sequelize");

const premiumfeatures = async (req, res, next) => {
  try {
           let users = await User.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']],
            include : [
                {
                    model : Expense,
                    attributes:[]
                }
            ],
            group:['user.id'],
            order:[['total_cost','DESC']]  // sorted des order
           })
           res.status(200).json(users)
        }catch(err){
         console.log(err)
        }
  }


module.exports = {
  premiumfeatures: premiumfeatures,
};
