require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express")
const userRoutes = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")

//express
const app = express();
app.use(express.json())

//routes
app.use(userRoutes);
app.use(taskRoutes);

//connect to database
mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT, () => {
      console.log("listening on port 3000");
    });
})