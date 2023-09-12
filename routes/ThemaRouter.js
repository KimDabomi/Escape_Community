const express = require("express");
const router = express.Router();
const modelThema = require('../models/modelThema');
// const passport = require("../../config/passport");
const MONGO_URI = "mongodb+srv://escape_developer:IWZ0q0jYUlXxZeCO@escape.jbdzlyx.mongodb.net";
const DB_NAME = "escape_thema";  
const COLLECTION_NAME = "store"; 



// Home
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
  



// router.get('/api/thema', async (req, res) => {
//     console.log('라우터왔다');
//     const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
//     let data = [];
//     try {
//         await client.connect();
//         const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
//         data = await collection.find({}).toArray();
//         res.json(data);  // 이 한 줄만으로 JSON 응답을 보낼 수 있습니다.
//         console.log('데이터 가져오기 성공!',res.json(data));
//     } catch (error) {
//         console.error("Error fetching data from MongoDB:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     } finally {
//         await client.close();
//     }
// });

module.exports = router; 
