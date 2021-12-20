require('dotenv').config();
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const Sentiment = require('sentiment');
const Twit = require('twit');
const { text } = require('cheerio/lib/api/manipulation');
const mongoose = require('mongoose');
const Crypto = require('./cryptodb');
const Users = require('./usersdb');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Constant Values
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@analysisdata.pwnel.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;
const cryptoNewsUrl = process.env.NEWS_DATA_URL;
const cryptoDataUrl = process.env.CRYPTO_DATA_URL;
const cryptoDataArrCM = [];
const cryptoNewsArrMC = [];
const cryptoSentArrTwit = [];
const T = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});
const sentiment = new Sentiment();
const app = express();
app.use(express.json());
app.use(cors());

// May vary later
let queries = ['#crypto', '#bitcoin', '#cryptocurrency', '#btc', '#ethereum', '#blockchain', '#trading', '#exchange', '#altcoins', '#cryptonews'];
let PORT = process.env.PORT || 3000;


// Initialise mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
const connection = mongoose.connection;
connection.once("open", () => { console.log("MongoDB database connection established successfully."); });


// Function to generate Signup and Access token
function generateSignupToken(user) { return jwt.sign(user, process.env.SIGNUP_TOKEN_SECRET, { expiresIn: '1d' } )};
function generateAccessToken(user) { return jwt.sign(user, process.env.AUTH_TOKEN_SECRET)};

// Function that Authenticates Signup and Access token
function authenticateSignupToken(req, res, next) {
    if (req.params.token == null) return res.status(401).json({error: "Access token error!."});
    jwt.verify(req.params.token, process.env.SIGNUP_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({ error: "Token is invalid or has expired." });
        req.email = user.email;
        req.username = user.username;
        next()
    });
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({error: "Need access token."});
    jwt.verify(token, process.env.AUTH_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({error: "Token is invalid or has expired."});
        req.email = user.email;
        next()
    });
}

// Function that fetches data Crypto News
async function getCryptoData () {
    try {
        for(let i = 1; i <= 4; i++) {
            const { data } = await axios({ 
                method: "GET" , 
                url: cryptoDataUrl + i,
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'
                },
                gzip: true
            });
            const $ = cheerio.load(data);
            const ele = '#__next > div.css-19qzm77 > div.chakra-container.css-p5b43h > div > div.css-1y0bycm > table > tbody > tr';
            $(ele).each(async function () {
                let tval = $(this).find('.css-4quyxq').text().trim();
                let idx = tval.lastIndexOf('$');
                let rank = $(this).find('.css-ohhbj0').text().trim();
                let name = $(this).find('.css-1mrk1dy').text().trim();
                let abbr = $(this).find('.css-44ctie').text().trim();
                let link = $(this).find('a').attr('href');
                let price = $(this).find('.css-b1ilzc').text().trim();
                let h24Change = $(this).find('.css-10swn3m').text().trim();
                let h24Volume = tval.substring(idx);
                let marketCap = tval.substring(0, idx);
                cryptoDataArrCM.push({rank, name, abbr, link, price, h24Change, h24Volume, marketCap});
            });
        }
        console.log('I am updated every 30 second!');
    } catch(err) { console.error(err); }
}

// Function that does sentiment analysis of a specified term through Twitter
function getCryptoSentiment (query) {
    T.get('search/tweets', { q: query, count: 10000 }, function(err, data, response) {
        let textall = '';
        data.statuses.map((tweets) => {
            let text = tweets.text;
            text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "");
            text = text.replace('@', "");
            text = text.replace('RT', "");
            textall += text;
        });
        let sentimentScore = sentiment.analyze(textall).score;
        let sentimentComparative = sentiment.analyze(textall).comparative;
        cryptoSentArrTwit.push({query, sentimentScore, sentimentComparative});
    });
}
// Function that iterates through all the popular hashtags of Twitter
function getCryptoSentimentTotal () {
    let id = 0;
    for (let i = 0; i < 10; i++) {
        getCryptoSentiment (queries[id]);
        id = id + 1;
    }
    console.log('I am updated every 10 Minutes!');
}

// Function that fetches data Crypto Data
async function getCryptoNews () {
    try {
        let id = 0;
        for(let i = 1; i <= 8; i++) {
            const { data } = await axios({ 
                method: "GET" , 
                url: cryptoNewsUrl + i,
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'
                },
                gzip: true
            });
            const $ = cheerio.load(data);
            $('ul#cagetory > li.clearfix', data).each(function() {
                let link = $(this).find('a').attr('href');
                let title = $(this).find('a').attr('title');
                let timeStamp = $(this).find('span').text().trim();
                let desc = $(this).find('p').text().trim();
                let image = $(this).find('a > img').attr('data');
                id += 1;
                cryptoNewsArrMC.push({id, title, desc, link, image, timeStamp});
            });
        }
        console.log('I am updated every 1 hour!');
    } catch(err) { console.error(err); }
}

// For Co-Relation Testing Purposes
function setDataForAnalysis () {
    cryptoDataArrCM.slice(0, 1).map(async (coin) => {
        let totScoreAvg = 0;
        let totCompAvg = 0;
        cryptoSentArrTwit.map((sent) => {
            totScoreAvg += sent.sentimentScore;
            totCompAvg += sent.sentimentComparative;
        });
        let timeNow = Math.round(Date.now()/1000);
        let dateNow = new Date();
        const newCrypto = new Crypto({
            time: timeNow,
            date: dateNow,
            btcPrice: coin.price,
            btc24hChange: coin.h24Change,
            btc24hVolume: coin.h24Volume,
            btcMarketCap: coin.marketCap,
            sentimentScoreAvg: totScoreAvg/10,
            sentimentCompAvg: totCompAvg/10,
        });
        await Crypto.create(newCrypto);
        return;
    });
    console.log('I am sent every 10 minutes!');
}

// Function that sets values initially
setTimeout(getCryptoData, 0); setInterval(function(){
    while (cryptoDataArrCM.length) { 
        cryptoDataArrCM.pop();
    }
    getCryptoData();
}, 30000);
setTimeout(getCryptoSentimentTotal, 0); setInterval(function(){
    while (cryptoSentArrTwit.length) { 
        cryptoSentArrTwit.pop(); 
    }
    getCryptoSentimentTotal();
}, 600000);
setTimeout(getCryptoNews, 0); setInterval(function(){
    while (cryptoNewsArrMC.length) { 
        cryptoNewsArrMC.pop(); 
    }
    getCryptoNews();
}, 3600000);
setTimeout(setDataForAnalysis, 35000); setInterval(setDataForAnalysis, 605677);

// Details
app.get('/', async (req, res) => { res.send("Make request to /api/signup to create user and then to /api/cryptodata, /api/cryptonews and /api/cryptosentiment for top 200 realtime crypto news, data and current sentiment.") });

// Route to signup for new users
app.post('/api/signup', async (req, res) => {
    try {
        const user = { username: req.body.username, email: req.body.email };
        const name = req.body.username;
        const uname = name[0].toUpperCase() + name.substring(1);
        const userFlag = await Users.exists({ email: req.body.email });
        if(userFlag) { return res.json({ error: "Please give another email! Email Exists" }); } 
        else {
            const signupToken = generateSignupToken(user);
            const accessToken = generateAccessToken(user);
            const url = `http://cryptolytical.herokuapp.com/api/confirmation/${signupToken}`;
            res.json({ message: "Sent verification email. Check Spam folders too!" });
            var transporter = nodemailer.createTransport({
                service: 'hotmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            let info = await transporter.sendMail({
                from: `"Cryptolytical" ${process.env.EMAIL}`,
                to: req.body.email,
                subject: "Kingshuk from Cryptolytical",
                html: `Hi,<br><b>${uname}</b>,<br>Thanks for choosing my Cryptolytical for your one of a kind project!<br><br>Here's your <b>Access Token</b>: <em>${accessToken}</em><br><br>But before that please visit this link to <b>verify your account</b> and use the API:-<br> <a href="${url}">Verify my account!</a><br><em>*This link expires in a day*</em>`,
            });
            console.log("Message sent!");
            return;
        }
    } catch (e) { res.status(500).json(e);}
});

// URL that authenticate users
app.get('/api/confirmation/:token', authenticateSignupToken, async (req, res) => {
    try {
        const newUser = new Users({
            username: req.username,
            email: req.email,
        });
        await Users.create(newUser);
        console.log("User verified!");
        return res.json({ message: "User verified!" });
    } catch (e) { res.send('error'); }
});

// Route to fetch Realtime Crypto Data
app.get('/api/cryptodata', authenticateToken, async (req, res) => {
    try {
        const userFlag = await Users.exists({ email: req.email });
        if(userFlag) {
            limit = req.query.limit || 10;
            page = req.query.page || 1;
            const startIdx = (page - 1) * 10;
            const endIdx = startIdx + parseInt(limit);
            const coinDatas = cryptoDataArrCM;
            return res.status(200).json({
                result: coinDatas.slice(startIdx, endIdx),
            });
        } else { return res.json({ error: "User not verified!" }) }
    } catch(err) {
        return res.status(500).json({
            err: err.toString(),
        });
    }
});

// Route to fetch Realtime Crypto News
app.get('/api/cryptonews', authenticateToken, async (req, res) => {
    try {
        const userFlag = await Users.exists({ email: req.email });
        if(userFlag) {
            limit = req.query.limit || 10;
            page = req.query.page || 1;
            const startIdx = (page - 1) * 10;
            const endIdx = startIdx + parseInt(limit);
            const newsData = cryptoNewsArrMC;
            return res.status(200).json({
                result: newsData.slice(startIdx, endIdx),
            });
        } else { return res.json({ error: "User not verified!" }) }
    } catch(err) {
        return res.status(500).json({
            err: err.toString(),
        });
    }
});

// Route to fetch Realtime Crypto Sentiment Through Tweets
app.get('/api/cryptosentiment', authenticateToken, async (req, res) => {
    try {
        const userFlag = await Users.exists({ email: req.email });
        if(userFlag) {
            const twitSentAna = cryptoSentArrTwit;
            const resarr = []
            let totScoreAvg = 0;
            let totCompAvg = 0;
            twitSentAna.map((sent) => {
                totScoreAvg += sent.sentimentScore;
                totCompAvg += sent.sentimentComparative;
            });
            totScoreAvg = totScoreAvg/10;
            totCompAvg = totCompAvg/10;
            resarr.push({...twitSentAna, totScoreAvg, totCompAvg});
            return res.status(200).json({
                result: resarr,
            });
        } else { return res.json({ error: "User not verified!" }) }
    } catch(err) {
        return res.status(500).json({
            err: err.toString(),
        });
    }
});

app.get('/api/cryptodata/:coin', authenticateToken, async (req, res) => {
    try {
        const userFlag = await Users.exists({ email: req.email });
        if(userFlag) {
            let coinName = req.params.coin;
            coinName = coinName.toUpperCase();
            const coinData = cryptoDataArrCM.find((coin) => {
                return coin.abbr === coinName
            });
            return res.status(200).json({
                result: coinData,
            });
        } else { return res.json({ error: "User not verified!" }) }
    } catch(err) {
        return res.status(500).json({
            err: err.toString(),
        });
    }
});

app.get('/api/cryptodata/coin/price', authenticateToken, async (req, res) => {
    try {
        const userFlag = await Users.exists({ email: req.email });
        if(userFlag) {
            let gt = req.query.gt || 0.00;
            let lt = req.query.lt || 100000.00;
            let limit = req.query.limit || 10;
            const coinData = cryptoDataArrCM.filter((coin) => {
                return parseFloat(coin.price.replace(/\$|,/g, '')) <= parseFloat(lt) && parseFloat(coin.price.replace(/\$|,/g, '')) >= parseFloat(gt)
            });
            return res.status(200).json({
                result: coinData.slice(0, limit),
            });
        } else { return res.json({ error: "User not verified!" }) }
    } catch(err) {
        return res.status(500).json({
            err: err.toString(),
        });
    }
});

app.listen(PORT, () => { console.log(`Running on Port ${PORT}.`); });
