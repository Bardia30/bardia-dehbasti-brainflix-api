const express = require("express");
const router = express.Router();
const fs = require("fs");



router.get('/', (req, res)=>{
    fs.readFile('./data/videos.json', 'utf8', (err, data)=>{
        const videoData = JSON.parse(data);
        if (err){
            res.status(401).send(err); //make sure status code is ok 
        } else {
            const filteredVideos = videoData.map(video => {
                return {
                    id: video.id, 
                    title: video.title, 
                    channel: video.channel, 
                    // image: `http://localhost:5050/videos/${video.image}` 
                    image: video.image
                }
            })
            res.status(200).json(filteredVideos);
        }
    })
})


router.get('/:videoId', (req, res)=>{
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        const videoData = JSON.parse(data);
        if (err) {
            res.status(401).send(err); //make sure status code is correct
        } else {
            const foundVideo = videoData.find(video => video.id === req.params.videoId );
            // const foundVideoWithUrl = {
            //     ...foundVideo,
            //     image: `http://localhost:5050/videos/${foundVideo.image}`
            // }
            if (foundVideo) {
                res.status(201).json(foundVideo);
                
            } else {
                res.status(404).json({
                    "message": `no video found with the id: ${req.params.videoId}`
                })
            }
        }
    });
});



module.exports = router;