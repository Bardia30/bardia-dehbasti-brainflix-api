const express = require("express");
const router = express.Router();
const fs = require("fs");



router.get('/', (req, res)=>{
    fs.readFile('./data/videos.json', 'utf8', (err, data)=>{
        const videoData = JSON.parse(data);
        if (err){
            res.status(401).send("Could not get games");
        } else {
            const filteredVideos = videoData.map(video => {
                return {
                    id: video.id, 
                    title: video.title, 
                    channel: video.channel, 
                    image: video.image 
                }
            })
            res.status(200).json(filteredVideos);
        }
    })
})



module.exports = router;