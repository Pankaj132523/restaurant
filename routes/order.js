const express= require('express');
const router=express.Router();
const {handleOrderPlace,getMyOrders}=require('../controller/order')

const {verifyJWT}=require('../middleware/auth')

router.use(verifyJWT);
router.route('/').post(handleOrderPlace).get(getMyOrders)

module.exports=router;