require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const fs = require("fs");
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


app.use(cors())



const videosRoutes = require('./routes/videos');

app.use('/videos', videosRoutes);



app.use(express.json());





const PORT = process.env.PORT || 5051 

app.get('/', (req, res)=>{
    res.status(200).send("<h1>Welcome to BrainFlix Backend API</h1>");
})





app.listen(PORT, ()=>{
    console.log(`server started for brainflix api on port http://localhost:${PORT}`);
})