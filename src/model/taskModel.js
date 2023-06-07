const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description :{
        type:String,
        trim:true,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true        
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    assignedTo:{
        type:String,
        required:true,
        ref:"User"
    }
},{
    timestamps:true
})


module.exports = mongoose.model("Task",taskSchema)
