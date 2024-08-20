const userdb=require('../model/user');
const jwt=require('jsonwebtoken');
require('dotenv').config()

const handleRefreshToken =async(req,res) =>{
    const  cookies=req.cookies;
    console.log(cookies.token);
    const refreshToken =cookies.token;
    if(!cookies?.jwt) return res.sendStatus(401);
    const userExist=await userdb.findOne({refreshToken:refreshToken});
    if(!userExist) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded) =>{
            if(err || userExist._id !== decoded._id ) return res.sendStatus(403);
            const roles=userExist.role
            const accessToken=jwt.sign(
                {id:user._id,email:email,role:roles},process.env.JWT_SECRET,{
                    expiresIn:"15m"
                }
            );
            res.json({accessToken})
        }
    )


}

module.exports ={handleRefreshToken}