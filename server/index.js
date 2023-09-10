const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ThemaRouter = require('./routes/ThemaRouter');
const path = require('path');

const app = express();
const PORT = 4000;

const MONGO_URI = "mongodb+srv://escape_developer:IWZ0q0jYUlXxZeCO@escape.jbdzlyx.mongodb.net";
const DB_NAME = "escape_thema";
const COLLECTION_NAME = "store";

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const scrapeAndInsertData = async () => {
    axios.get('https://colory.mooo.com/catalogue').then(async response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];  // 배열로 초기화
    
        $("*[id^='theme-button-']").each((index, buttonElement) => {
            let region = $(buttonElement).find('.select-area').text().trim();
            
            $(buttonElement).find(`tbody tr`).each((trIndex, trElement) => {
                const store = $(trElement).find('.info-1').text() || (results.length > 0 ? results[results.length - 1].store : "");
                const name = $(trElement).find('.info-2').text();
                const star = parseFloat($(trElement).find('.info-3').text());
                const level = parseInt($(trElement).find('.info-4').text(), 10);
                const review_cnt = parseInt($(trElement).find('.info-5').text(), 10);
    
                results.push({
                    region,
                    store,
                    name,
                    star,
                    level,
                    review_cnt
                });
            });
        });
    
        // MongoDB에 데이터 삽입
        const client = new MongoClient(MONGO_URI, { useUnifiedTopology: false });
        try {
            await client.connect();
            const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
            await collection.insertMany(results);
            console.log("데이터 추가 성공");
            console.log('-----------------results-------------',typeof(results));
        } catch (error) {
            console.error("Error inserting data into MongoDB:", error);
        } finally {
            await client.close();
        }
    }).catch(error => {
        console.error("Error fetching the URL:", error);
    });
};
// scrapeAndInsertData();

app.use('/api/thema',ThemaRouter);
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/build/index.html'));
});