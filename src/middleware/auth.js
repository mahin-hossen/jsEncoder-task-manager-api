const jwt = require("jsonwebtoken")
const User = require("../model/userModel")

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace("Bearer ","")
        const decoded = jwt.verify(token,process.env.SECRET)    //verify jwt
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})  //auth check

        if(!user)   throw new Error("Please authenticate.")

        //storing user info
        req.token = token   
        req.user = user

        next()
    }catch(err){
        res.status(401).send({error:"Please authenticate"})
    }
}

module.exports = auth