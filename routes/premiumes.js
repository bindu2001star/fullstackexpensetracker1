const express=require('express');
const router=express.Router();
const autherization=require('../middleware/Auth');
const premiumfeaturess=require('../controller/premiumfeaturing')
router.get('/showLeaderboard',autherization.authenticate,premiumfeaturess.premiumfeatures);
module.exports=router;