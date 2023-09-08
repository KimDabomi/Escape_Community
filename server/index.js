const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ThemaRouter = require('../routes/ThemaRouter');
const path = require('path');

const app = express();
const PORT = 4000;

const MONGO_URI = "mongodb+srv://escape_developer:IWZ0q0jYUlXxZeCO@escape.jbdzlyx.mongodb.net";
const DB_NAME = "escape_thema";
const COLLECTION_NAME = "store";


app.use(cors());
app.use(ThemaRouter);
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const scrapeAndInsertData = async () => {
    axios.get(url).then(async response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const results = {};  // 객체로 초기화
    
        $("*[id^='theme-button-']").each((index, buttonElement) => {
            let key = $(buttonElement).find('.select-area').text().trim();
            let themeResults = [];
            $(buttonElement).find(`tbody tr`).each((trIndex, trElement) => {
                const store = $(trElement).find('.info-1').text() || (themeResults.length > 0 ? themeResults[themeResults.length - 1].store : "");
                const name = $(trElement).find('.info-2').text();
                const star = parseFloat($(trElement).find('.info-3').text());
                const level = parseInt($(trElement).find('.info-4').text(), 10);
                const review_cnt = parseInt($(trElement).find('.info-5').text(), 10);
    
                themeResults.push({
                    store,
                    name,
                    star,
                    level,
                    review_cnt
                });
            });
            results[key] = themeResults;  // 키를 사용하여 결과에 themeResults를 할당
        });
    
        // MongoDB에 데이터 삽입
        const client = new MongoClient(MONGO_URI, { useUnifiedTopology: false });
        try {
            await client.connect();
            const collection = client.db(DB_NAME).collection(COLLECTION_NAME);
            await collection.insertMany(Object.entries(results).map(([key, value]) => ({ key, value })));
            console.log("Data inserted successfully!");
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