const express=require('express');
const router=express.Router();
const passwordController=require('../controller/passwording');
router.post('/forgotpassword',passwordController.forgotpassword);
module.exports=router;