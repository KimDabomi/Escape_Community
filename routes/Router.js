const express = require("express");
const router = express.Router();
const modelThema = require('../models/modelThema');
const modelPost = require('../models/modelPost');


// 테마 불러오기
router.get("/api/thema", async (req, res) => {
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
        console.error("테마목록 라우팅 실패: ", error);
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
            'id': oPost.id,
            'title': oPost.title,
            'content': oPost.content
        }));
        res.json({ aPost: formattedList });
    } catch (error) {
        console.error("글목록 라우팅 실패: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// 글보기
router.get("/api/view/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await modelPost.findOne({ id: postId });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const formattedPost = {
            'title': post.title,
            'content': post.content
        };

        res.json(formattedPost);
    } catch (error) {
        console.error("글보기 라우팅 실패: ", error.message, error.stack);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// 글수정
router.put("/api/update/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await modelPost.findOneAndUpdate({ id: postId }, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error("글수정 라우팅 실패: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// 글삭제
router.delete("/api/delete/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await modelPost.findOneAndDelete({ id: postId });

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("글삭제 라우팅 실패: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});







module.exports = router; 
