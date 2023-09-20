const express = require("express");
const router = express.Router();
const modelThema = require('../models/modelThema');
const modelPost = require('../models/modelPost');
const modelUsers = require('../models/modelUsers');
const passport = require('../config/passport');

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




// 로그인
router.get("/login", async function (req, res) {
    const errors = req.flash("errors")[0] || {};
    const info = req.flash("info")[0] || {};
    console.log("login get info", info);
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
        if (err) {
            console.error("패스포트 에러: ", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!user) {
            return res.status(401).json({ error: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("로그인 에러: ", err);
                return res.status(500).json({ error: "Failed to log in" });
            }
            console.log("로그인 후 세션: ", req.session);
            req.session.username = user.username;
            console.log("세션에 저장된 username: ", req.session.username); // 이 부분 추가
            const userResponse = {
                id: user.id,
                username: user.username
            };
            return res.json({ success: true, user: userResponse });
        });
    })(req, res, next);
});

// 세션
router.get("/api/session", (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ username: req.session.username });
    } else {
        return res.status(401).json({ error: "Not authenticated" });
    }
});






// 로그아웃
router.get("/logout", function (req, res) {
    req.logout((a) => res.redirect("/login"));
});


// 회원가입
router.get("/register", function (req, res) {
    res.render("register", {
        test: { abc: "mart" },
    });
});

router.post("/register", async function (req, res) {
    const { username, password, name, passwordConfirmation } = req.body;
    try {
        const oResult = await modelUsers.create({
            username: username,
            password: password,
            name: name,
            passwordConfirmation: passwordConfirmation,
        });
        console.log("oResult", oResult);
        if (oResult) {
            res.json({
                register: true,
            });
        }
    } catch (error) {
        res.json({
            register: false,
            message: "에러가 발생했습니다: " + error.message,
        });
    }
});




module.exports = router; 
