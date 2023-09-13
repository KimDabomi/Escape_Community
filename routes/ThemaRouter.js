const express = require("express");
const router = express.Router();
const modelThema = require('../models/modelThema');


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
  



module.exports = router; 
