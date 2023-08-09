const express=require('express');
const router=express.Router();
const expenseController=require('../controller/expensing');
const authentication=require('../middleware/Auth');

router.post('/Addexpense',authentication.authenticate,expenseController.addexpense);
router.get('/Getexpense',authentication.authenticate,expenseController.getExpenses);
router.delete('/deleteExpense/:id',authentication.authenticate,expenseController.deleteExpense);
module.exports=router

