const express=require('express');
const router= express.Router();
const {register,login}=require('../controller/user')
const {handleRefreshToken} =require('../controller/refreshtoken')
const {handleLogout}=require('../controller/logout')

router.route('/register').post(register);

router.route('/login').post(login)

router.route('/refreshToken').get(handleRefreshToken)
router.route('/logout').get(handleLogout)

module.exports=router;