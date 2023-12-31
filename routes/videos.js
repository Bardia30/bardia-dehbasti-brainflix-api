const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');


router.use(express.json());

//sends all videos information, does not send the entire info, just enough for articles section
router.get('/', (req, res)=>{
    fs.readFile('./data/videos.json', 'utf8', (err, data)=>{
        const videoData = JSON.parse(data);
        if (err){
            res.status(401).send(err); 
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


//sends detailed info about a single video
router.get('/:videoId', (req, res)=>{
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        const videoData = JSON.parse(data);
        if (err) {
            res.status(400).send(err); 
        } else {
            const foundVideo = videoData.find(video => video.id === req.params.videoId );
            if (foundVideo) {
                res.status(200).json(foundVideo);
            } else {
                res.status(404).json({
                    "message": `no video found with the id: ${req.params.videoId}`
                })
            }
        }
    });
});

//posting a new video to the db 
router.post('/', (req, res)=>{
    const userTitle = req.body.videoTitle;
    const userDescription = req.body.videoDescription;
    //checks if the title and description are empty, send an error
    if (userTitle === "" || userDescription === "" ) {
        return res.status(400).send("cannot add a video without a title or description")
    }

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
    
})

//posting a new comment to a specific video
router.post('/:videoId/comments', (req, res) => {
    const userComment = req.body.comment;

    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        if (err) {
            return res.send(err);
        }
        const videoData = JSON.parse(data);
        const foundVideo = videoData.find(video => video.id == req.params.videoId);
        
        
        const commentsData = foundVideo.comments;
        
        const newComment = {
            id: uuidv4(),
            name: "Bardia",
            comment: userComment,
            likes: 0,
            timestamp: Date.now()
        }

        commentsData.push(newComment);

        fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err)=>{
            if (err){
                return res.send(err);
            }
            res.status(201).send(`your comment has been added`);
        })
    })
})



//delete a specific comment in a specific video
router.delete('/:videoId/comments/:commentId', (req, res)=>{
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;

    fs.readFile('./data/videos.json', 'utf8', (err, data)=> {
        if (err) {
            return res.send(err);
        }
        const videoData = JSON.parse(data);
        const foundVideo = videoData.find(video => video.id === videoId);
        
        const videoComments = foundVideo.comments;
        const foundComment = videoComments.find(comment => comment.id === commentId);

        const commentIndex = videoComments.indexOf(foundComment);
        videoComments.splice(commentIndex, 1);

        fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err)=> {
            if (err) {
                return res.send(err);
            }
            res.status(200).send(`your comment has been deleted`);
        })
    })
})



router.put('/:videoId/likes', (req, res) => {
    const videoId = req.params.videoId;

    fs.readFile('./data/videos.json', 'utf8', (err, data)=> {
        if (err){
            return res.send(err);
        }
        const videoData = JSON.parse(data);
        const videoFound = videoData.find(video => video.id === videoId);


        let videoLikes = videoFound.likes;
        //checks if like value is a string or not and acts accordingly
        if (typeof videoLikes === 'string'){
            let videoLikesArray = videoLikes.split(',');
            let videosLikesJoined = Number(videoLikesArray.join(''));
            videosLikesJoined += 1;
            videoFound.likes = videosLikesJoined;
        } else {
            videoLikes += 1;
            videoFound.likes = videoLikes;
        }
        

        fs.writeFile('./data/videos.json', JSON.stringify(videoData), (err) => {
            if (err) {
                return res.send(err);
            }
            res.status(200).send('video likes has been updated');
        })
    })
})



module.exports = router;