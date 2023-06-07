const express = require("express")
const router = new express.Router()
const User = require("../model/userModel")
const validator = require("validator")
const authMiddleware = require("../middleware/auth")

//user signup
router.post("/user/signup", async (req, res) => {
    const user = new User(req.body);

    try{    
        
        //email,pass validation
        if(!validator.isStrongPassword(req.body.password,{minLength:8}))
        {
          throw new Error(`Password isn't strong enough`)
        }
        else if(!validator.isEmail(req.body.email))
        {
          throw new Error("Email isn't valid")
        }            

        await user.save() //checking whether input is valid & saving
        const token = await user.generateAuthToken()  //generating jwt token

        res.status(201).send({user,token})
    }catch(error){
        if(error.code==11000) res.status(400).send({error:"Email already in use"})
        else   res.status(400).send({error:err.message});
    }
});

//user login
router.post("/user/login",async (req,res)=>{
    try{
      const user = await User.findByCredentials(req.body.email,req.body.password)  //credential matching
      const token = await user.generateAuthToken() //generating jwt token
  
      res.status(200).send({user,token})
    }catch(error){
      res.status(400).send({error:error.message})
    }
})

//user logOut
router.post("/user/logout",authMiddleware, async(req,res)=>{
    try{
        //removing current token from tokens array 
        req.user.tokens = req.user.tokens.filter((item)=>{
            return item.token !== req.token
        })
        
        await req.user.save()
        res.send("You have been successfully logged out.")
    }catch(error){
      res.status(500).send({error:"Unable to logout. Please try again later."})
    }
})

//user logout from all device
router.post("/user/logoutall",authMiddleware, async(req,res)=>{
    try{
      req.user.tokens = []  //deleting all token
      await req.user.save()
      res.status(200).send("You have been successfully logged out from all devices")
    }catch(error){
      res.status(500).send({error:"Unable to logout. Please try again later."})
    }
})

//user info
router.get("/user/me",authMiddleware, async (req, res) => {
    try{
        res.status(200).send(req.user);
    }catch(error){
        res.status(500).send({error:"Error retrieving user information. Please try again later"})
    }
});

//user info modify
router.patch("/user/me",authMiddleware,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name","email","password",]
    const isValidOperation = updates.every((update)=>{
      return allowedUpdates.includes(update)
    })
  
    if(!isValidOperation) return res.status(400).send({error:"Unable to update user information. Please check your inputs and try again.!!"})
  
    try{
      const user = req.user
        
      //adding properties to user
      updates.forEach((update)=>{
        user[update] = req.body[update]
      })
  
      await user.save()
      
      if(!user) return res.status(404).send({error:"User not found. Unable to update user information."})

      res.status(201).send(user)
    }catch(error){
      res.status(400).send({error:"Unable to update user information. Please try again later!!"})
    }
})




module.exports = router