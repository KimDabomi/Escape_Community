const express = require('express');
const { MongoClient } = require('mongodb');  
const router = express.Router();

const MONGO_URI = "mongodb+srv://escape_developer:IWZ0q0jYUlXxZeCO@escape.jbdzlyx.mongodb.net";
const DB_NAME = "escape_thema";  
const COLLECTION_NAME = "store"; 

router.get('/api/thema', async (req, res) => {
    const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    let data = [];
    try {
        await client.connect();
        const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
        data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await client.close();
    }
});

module.exports = router; 
