// 
const jwt = require('jsonwebtoken');
const User = require('../model/user');
exports.authenticate=async(req,res,next)=>{ 
    try{
        const token = req.header("Authorization");
        console.log("token value : ",token);
         if(!token){
             return res.status(401).json({sucess:false})
        }

        const secretKey = 'secretKey'
        const decoded = jwt.verify(token,secretKey);
        console.log("decoded: ",decoded);
        const userId = decoded.userId;
        console.log('userId >>>>>>', userId)
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(401).json({message:"Unauthorised: User does not exist"});
        }
        
        req.user = user;
        console.log(req.user);
        next();
    }catch(err){
        console.log("Error occured while authenticating user : ",err.message);
        return res.status(401).json({message:"Unauthorised"});
    }
};