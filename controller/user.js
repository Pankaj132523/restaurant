const userdb=require('../model/user')
const bcrpyt= require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const register=async(req,res)=>{
    try {
        const {firstname,lastname,email,password}=req.body 
        if(!(firstname && lastname && email && password)){
            res.status(400).send('all the fields are mandatory')
        }
        const existingUser=await userdb.findOne({email:email})
        // console.log(existingUser,'sss');
        
        if(existingUser) {  
            res.status(400).send('user already exists')
        }      
        else{
            const encrptedPassword = await bcrpyt.hash(password,10)
            const user={
                firstname:firstname,
                lastname:lastname,
                email:email,
                password:encrptedPassword,
                role:1921
            }
            await userdb.create(user);
            const accessToken=jwt.sign(
                {id:user._id,email:email,role:1921},process.env.JWT_SECRET,{
                    expiresIn:"15min"
                }
            );
            const refreshToken=jwt.sign(
                {id:user._id,email:email},process.env.REFRESH_TOKEN_SECRET,{
                    expiresIn:"1d"
                }
            );
            await userdb.updateOne({email:email},{$set:{refreshToken:refreshToken}})         
            res.status(200).json({accessToken})
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

const login=async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!(email && password)){
            res.status(400).send("pls enter valid details")
        }
        const user= await userdb.findOne({email:email});

        if(!user){
            res.status(401).send('user does not exist')
        }
        const passwordMatched=await bcrpyt.compare(password,user.password);
        if(!passwordMatched) return res.status(401).json({Success:false})
        if(user && passwordMatched){
            const roles=user.role
            console.log(roles);
            
            const accessToken=jwt.sign(
                {id:user._id,email:email,role:roles},process.env.JWT_SECRET,{
                    expiresIn:"15m"
                }
            );
            const refreshToken=jwt.sign(
                {id:user._id,email:email},process.env.REFRESH_TOKEN_SECRET,{
                    expiresIn:"1d"
                }
            );
            await userdb.updateOne({email:email},{$set:{refreshToken:refreshToken}})         
            user.token=accessToken;
            user.password=undefined;

            const options={
                maxAge:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            };
            res.status(200).cookie("token",refreshToken,options)
            res.json({accessToken});
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={register,login};