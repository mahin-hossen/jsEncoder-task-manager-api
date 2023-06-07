const express = require("express");
const router = new express.Router();
const authMiddleware = require("../middleware/auth")
const Task = require("../model/taskModel");

//create tasks
router.post("/tasks", authMiddleware,async (req, res) => {
    console.log("hello")
    try{
        console.log("req",req.body)
        const task = new Task({
            ...req.body,
            createdBy:req.user._id
          })

        console.log("here")
        task
        .save()
        .then(() => {
          res.status(201).send(task);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }catch(error){
        console.log("err")
        res.status(400).send(error);
    }


});

module.exports = router