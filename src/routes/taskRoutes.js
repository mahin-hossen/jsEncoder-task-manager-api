const express = require("express");
const router = new express.Router();
const authMiddleware = require("../middleware/auth")
const Task = require("../model/taskModel");

//create tasks
router.post("/tasks", authMiddleware,async (req, res) => {

    try{

        const task = new Task({
            ...req.body,
            createdBy:req.user._id
          })

        task
        .save()
        .then(() => {
          res.status(201).send(task);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }catch(error){
        res.status(400).send({error:"Couldn't create task. Please try again later"});
    }


});

//get all tasks created by current user
router.get("/tasks/created",authMiddleware, async (req, res) => {
  const _id = req.user._id;
  
  try {    
    const task = await Task.find({createdBy:_id})

    if (!task) return res.status(200).send("No current task found for the user.");

    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({error:"Couldn't fetch the available tasks. Please try again later!"});
  }
});

//get all assigned task for current user
router.get("/tasks/assigned",authMiddleware, async (req, res) => {
  const email = req.user.email;
  
  try {    
    const task = await Task.find({assignedTo:email})

    if (!task) return res.status(200).send("No current task found for the user.");

    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({error:"Couldn't fetch the available tasks. Please try again later!"});
  }
});

//update task by id
router.patch("/tasks/:id",authMiddleware, async (req, res) => {
  const allowedUpdates = ["status"];  
  const updates = Object.keys(req.body);

  const isValidUpdates = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidUpdates)  //if other properties tried to modify
  {
    return res.status(404).send({ error: "Not valid Inputs" });
  } 
  else if(req.body.status!=="in progress" && req.body.status!="completed" && req.body.status!="pending")
  {
    return res.status(404).send({ error: "Not valid Inputs" });
  }

  try {
    const task = await Task.findOne({_id:req.params.id})

    if (!task) return res.status(404).send();

    task["status"]=req.body["status"]
    await task.save()
    
    res.status(200).send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});

//delete tasks by id 
router.delete("/tasks/:id",authMiddleware, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({_id:_id})

    if (!task) res.status(404).send({error:"No such tasks found"});

    //whether createdby current user
    else if(task.createdBy.equals(req.user._id)){
      await Task.findOneAndDelete({_id:_id,createdBy:req.user._id})
      res.status(200).send(`Successfully deleted task`);
    }
    else{
      res.status(404).send({error:"You can't delete task created by others."})
    } 

  } catch (error) {
    res.status(404).send({error:"Couldnt delete task. Please try again later."});
  }
});

//filter tasks by id
router.get("/tasks",authMiddleware, async (req, res) => {
  const match = {}
  
  //properties available on query
  if(req.query.status){
    match.status = req.query.status
  }
  if(req.query.assignedto){
    match.assignedTo=req.query.assignedto
  }
  if(req.query.duedate){
    match.dueDate=new Date(req.query.duedate).toISOString()
  }

  try{
    await req.user.populate({
      path:"userTasks",
      match
    })
    res.send(req.user.userTasks)
  }catch(error){
    res.status(500).send({error:"Couldnt fetch tasks. Please try again later!"})
  }
});


module.exports = router