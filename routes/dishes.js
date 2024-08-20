const express=require('express');
const router=express.Router();
const {getDishes,addDish,updateQuantitiy,deleteDish}=require('../controller/dishes')
const {verifyJWT,verifyRoles}=require('../middleware/auth')
const ROLES_LIST=require('../configs/roles')
router.use(verifyJWT)
router.route('/').get(getDishes).post(verifyRoles(ROLES_LIST.Admin),addDish).put(verifyRoles(ROLES_LIST.Admin),updateQuantitiy).delete(verifyRoles(ROLES_LIST.Admin),deleteDish);

module.exports=router;