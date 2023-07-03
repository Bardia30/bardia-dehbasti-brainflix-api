require('dotenv').config();
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

const videosRoutes = require('./routes/videos');

app.use('/videos', videosRoutes);



app.use(express.json());

app.use(express.static("public"));


app.use(cors({
    origin: "http://localhost:3000"
}))

const PORT = process.env.PORT || 5051 

app.get('/', (req, res)=>{
    res.status(200).send("<h1>Welcome to BrainFlix Backend API</h1>");
})





app.listen(5050, ()=>{
    console.log(`server started for brainflix api on port http://localhost:${PORT}`);
})