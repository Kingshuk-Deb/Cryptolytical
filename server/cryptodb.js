const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cryptoSchema = new Schema({
    time: Number,
    date: String,
    btcPrice: String,
    btc24hChange: String,
    btc24hVolume: String,
    btcMarketCap: String,
    sentimentScoreAvg: Number,
    sentimentCompAvg: Number,
});

const Crypto = mongoose.model("crypto", cryptoSchema);

module.exports = Crypto;