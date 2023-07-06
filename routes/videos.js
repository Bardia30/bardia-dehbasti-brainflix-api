const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');


router.use(express.json());


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


router.post('/', (req, res)=>{
    const userTitle = req.body.videoTitle;
    const userDescription = req.body.videoDescription;
    //TODO: check if title and description are empty or not

    fs.readFile('./data/videos.json', 'utf8', (err, data)=>{
        if (err) {
            return res.send(err);
        }
        const videoData = JSON.parse(data);

        const newVideo = {
            id: uuidv4(),
            title: userTitle,
            channel: 'bardiCodes',
            image: 'user-image/Upload-video-preview.jpg',
            description: userDescription,
            views: Math.round(Math.random() * 1000000) + 1000,
            likes: Math.round(Math.random() * 10000),
            duration: `${Math.round(Math.random()*12)}:${Math.round(Math.random()*5)}${Math.round(Math.random()*9)}`,
            video: "https://project-2-api.herokuapp.com/stream",
            timestamp: Date.now(),
            comments: [],
        };

        videoData.push(newVideo);

        fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err)=>{
            if (err){
                return res.send(err);
            }
            res.status(201).send(`your new video titled "${req.body.videoTitle}" has been uploaded`);
        })
    })
    // res.status(201).json(`your new video titled "${req.body.videoTitle}" has been uploaded`);
})


module.exports = router;