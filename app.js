const dotenv = require("dotenv");
dotenv.config();
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
var cors = require('cors');
const sequelize=require('./util/database');
//const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const fs=require('fs');

console.log(process.env.DB_NAME);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'view')));
app.use(cors());

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{
    flags:'a'
})

app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));


const User=require('./model/user');
const Expense=require('./model/userexpense');
const order=require('./model/order');
const downloadReport=require('./model/downloadreport');


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','signup.html'));
}); 
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','login.html'));
})
const userRoute=require('./routes/users');
const expenseRoute=require('./routes/expenses');
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premiumes');
const passwordRoute=require('./routes/forgotpassword');
const { Stream } = require('stream');

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute);

app.use((req,res)=>{
    console.log('urlllllllll1111',req.url);
    res.sendFile(path.join(__dirname,`view/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);


User.hasMany(order);
order.belongsTo(User);

User.hasMany(downloadReport);
downloadReport.belongsTo(User);

sequelize.sync({force:false})
.then(()=>{
    console.log('details synchronised with database')
})
.catch((err)=>{
    console.log(err)
})
app.listen(process.env.PORT || 3000);