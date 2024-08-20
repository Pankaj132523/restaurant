const jwt=require('jsonwebtoken');
require('dotenv').config();

const verifyJWT=(req,res,next)=>{
    const authHeader= req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer')) return res.sendStatus(401);
    const token =authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(403);
            req.userId=decoded.id
            req.role=decoded.role
            next()
        }
    )
}

const verifyRoles=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req?.role){
            return res.sendStatus(401)
        }
        const rolesAraay =[...allowedRoles];
        console.log(rolesAraay);
        console.log(req.roles);
        const result =rolesAraay.includes(req.role);
        if (!result) return res.sendStatus(401);
        next()
        
        
    }
}
module.exports={verifyJWT,verifyRoles}