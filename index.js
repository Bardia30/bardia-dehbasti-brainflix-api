require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const fs = require("fs");
const path = require('path');

//cors middleware to allow for other origins to access our backend api
app.use(cors());

//middleware to send the public folder files to the frontend
app.use(express.static(path.join(__dirname, 'public')));

//setting up the /videos routes
const videosRoutes = require('./routes/videos');

app.use('/videos', videosRoutes);


//middleware that acts as a parser for incoming request body that contains JSON data. 
app.use(express.json());


//extracting the specified port from .env file, and a plan-b if 5050 did not work
const PORT = process.env.PORT || 5051 


app.get('/', (req, res)=>{
    res.status(200).send("<h1>Welcome to BrainFlix Backend API</h1>");
})



app.listen(PORT, ()=>{
    console.log(`server started for brainflix api on port http://localhost:${PORT}`);
})