const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")

//jwt expires in
const jwtMaxAge = 60 * 60 * 24 * 30 //30day

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required: true
    },
    password:{
        type:String,
        required:true,
        minLength:8        
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
},{
    timestamps:true
})

userSchema.virtual("userTasks",{
    ref:"Task",
    localField:"_id",
    foreignField:"createdBy"
})


//generate jwt token
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const _id = user._id

    const token = jwt.sign({_id:_id},process.env.SECRET)
    console.log("user",user)
    user.tokens = user.tokens.concat({token:token}) //saving jwt token
    console.log("user",user)
    await user.save()
    return token
}

//hashing password
userSchema.pre("save",async function(next){
    const user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

//credential matching
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email}) //if email exists in db
    if(!user){
        throw new Error("Invalid login credentials")
    }
    
    const isMatch = await bcrypt.compare(password,user.password) //if password matched
    
    if(!isMatch){
        throw new Error("Invalid login credentials")
    } 
    
    return user
}

//removing password & tokens while sending data to client
userSchema.methods.toJSON = function(){
    const user = this
    const publicProfile = user.toObject()

    delete publicProfile.tokens
    delete publicProfile.password

    return publicProfile
}

const User = mongoose.model("User",userSchema)
module.exports = User