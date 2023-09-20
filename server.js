const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const schedule = require('node-schedule');
const modelThema = require('./models/modelThema');
const app = express();

const MONGO_URI = "mongodb+srv://escape_developer:IWZ0q0jYUlXxZeCO@escape.jbdzlyx.mongodb.net/escape";
const DB_NAME = "escape_thema";
const COLLECTION_NAME = "store";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', function (err) {
    console.error('DB ERROR : ', err);
});

db.once('open', function () {
    console.log('DB 연결됨');

    // 1일 1회 테마정보 업데이트
    const ThemaUpdateSchedule = schedule.scheduleJob('0 0 * * *', async function () {
        try {
            // 웹 스크래핑을 사용하여 데이터 가져오기
            const response = await axios.get('https://colory.mooo.com/catalogue');
            const html = response.data;
            const $ = cheerio.load(html);
            const scrapedResults = [];
    
            $("*[id^='theme-button-']").each((index, buttonElement) => {
                let region = $(buttonElement).find('.select-area').text().trim();
    
                $(buttonElement).find(`tbody tr`).each((trIndex, trElement) => {
                    const store = $(trElement).find('.info-1').text() || (scrapedResults.length > 0 ? scrapedResults[scrapedResults.length - 1].store : "");
                    const thema = $(trElement).find('.info-2').text(); 
                    const star = parseFloat($(trElement).find('.info-3').text());
                    const level = parseInt($(trElement).find('.info-4').text(), 10);
                    scrapedResults.push({
                        region,
                        store,
                        thema,
                        star,
                        level
                    });
                });
            });
    
            // 웹 스크래핑한 데이터와 MongoDB의 데이터를 비교하여 새로운 데이터만 필터링
            const existingData = await modelThema.find({}).exec();
    
            const newEntries = scrapedResults.filter(scrapedItem => 
                !existingData.some(existingItem => 
                    existingItem.store === scrapedItem.store && existingItem.thema === scrapedItem.thema
                )
            );
    
            // 새로운 데이터만 MongoDB에 삽입
            if (newEntries.length > 0) {
                await modelThema.insertMany(newEntries);
                console.log("새로운 데이터 추가 성공:", newEntries.length);
            } else {
                console.log("새로운 데이터가 없습니다.");
            }
    
        } catch (error) {
            console.error('에러 발생: ', error);
        }
    });
})





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(cors());


session,
app.use(session({
    secret: 'escape',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));


// Passport
app.use(passport.initialize());
app.use(passport.session());


// locals
// app.use(function (req, res, next) {
//     res.locals.isAuthenticated = req.isAuthenticated();
//     res.locals.currentUser = req.user;
//     res.locals.util = util;
//     next();
// });

app.use(express.static(__dirname + '/client/build'));

// Routes
app.use('/',require('./routes/Router'));

// error
// app.use(function (req, res, next) {
//     res.status(400).render('error/404');
// });
// app.use(function (error, req, res, next) {
//     console.error(error)
//     res.status(500).render('error/500');
// });

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
  

// Port setting
const port = 4001;
app.listen(port, '0.0.0.0', function () {
    console.info('server on! http://localhost:' + port);
});

