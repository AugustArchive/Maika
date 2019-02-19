const { Schema, model } = require('mongoose');
module.exports = model('reminders', new Schema({
    userID: String,
    timeout: Number,
    reason: String
}), 'reminders');