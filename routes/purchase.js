const express=require('express');
const router=express.Router();
const autherization=require('../middleware/Auth');
const purchasecontroller=require('../controller/purchasing')
router.get('/premiumMembership',autherization.authenticate,purchasecontroller.purchasePremium);
 router.post('/updatetransectionstatus',autherization.authenticate,purchasecontroller.updatetransectionstatus);

module.exports=router;