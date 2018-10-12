const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Story = new Schema({
    name: String,
    userId: String,
    date: String
    //add additional formation info later
});

module.exports = mongoose.model('stories', Story);
