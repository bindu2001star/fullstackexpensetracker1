const express=require('express');
const router=express.Router();
const passwordController=require('../controller/passwording');
router.post('/forgotpassword',passwordController.forgotpassword);
router.get('/reset-password/:id',passwordController.resetpassword);
router.get('/update-password/:id',passwordController.updatepassword);
module.exports=router;