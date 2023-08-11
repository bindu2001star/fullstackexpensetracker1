const User=require('../model/user');
const Expense=require('../model/userexpense');
const Sequelize=require('../util/database');
const premiumfeatures = async (req, res, next) => {
    try{
        const users=await User.findAll();
        const expenses=await Expense.findAll();
        const aggregatedexpenses={}
        expenses.forEach(expense=>{
            if(aggregatedexpenses[expense.userId]){
                aggregatedexpenses[expense.userId]=aggregatedexpenses[expense.userId]+expense.amount
            }
            else{
                aggregatedexpenses[expense.userId]=expense.amount;
            }
        })
        var userleadrdetails=[];
        users.forEach((user)=>{
            userleadrdetails.push({name:user.name,total_cost:aggregatedexpenses[user.id]||0})

        })
        console.log("aggggreegatt",aggregatedexpenses);
        userleadrdetails.sort((a,b)=>b.total_cost-a.total_cost)
        return res.status(200).json(userleadrdetails);


    }catch(err){
        console.log(err);
        return res.status(500).json({err});
    }
 
};

module.exports = {
  premiumfeatures: premiumfeatures,
};
