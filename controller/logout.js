const userdb=require('../model/user');

const handleLogout=async(req,res)=>{
      const cookies =req.cookies;
      if(!cookies?.token) return res.sendStatus(204);
      const refreshToken=cookies.token;
      const existingUser=userdb.find({refreshToken:refreshToken});
      if(!existingUser){
        res.clearCookie('token',{httpOnly:true});
        return res.sendStatus(204);
      }

      await userdb.updateOne({email:existingUser.email},{$set:{refreshToken:''}})  
      res.clearCookie('token',{httpOnly:true});
      res.sendStatus(204)
}

module.exports={handleLogout}