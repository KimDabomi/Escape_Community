const express = require("express");
const router = express.Router();
const modelThema = require('../models/modelThema');
const modelPost = require('../models/modelPost');


// 테마 불러오기
router.get("/api/thema", async (req, res) => {
    console.log('ROUTER!!!!!!!!!!');
    try {
        const themaList = await modelThema.find();
        const formattedList = themaList.map(oThema => ({
            'region': oThema.region,
            'store': oThema.store,
            'thema': oThema.thema,
            'star': oThema.star,
            'level': oThema.level
        }));

        res.json({ aThema: formattedList });
    } catch (error) {
        console.error("Error fetching thema:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  

// 글쓰기
router.post('/api/create', async (req, res) => {
    try {
        const newPost = new modelPost(req.body);
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});


// 글불러오기
router.get("/api/read", async (req, res) => {
    try {
        const postList = await modelPost.find();
        const formattedList = postList.map(oPost => ({
            'title': oPost.title,
            'content': oPost.content
        }));
        res.json({ aPost: formattedList });
    } catch (error) {
        console.error("Error fetching thema:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router; 
