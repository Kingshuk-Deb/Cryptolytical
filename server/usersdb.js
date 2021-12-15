const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true,
    }
});

const Users = mongoose.model("user", userSchema);

module.exports = Users;