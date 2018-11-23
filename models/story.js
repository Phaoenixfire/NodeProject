const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Story = new Schema({
    userId: String,
    date: String,
    title: String,
    lines: Array,
    author: String,
    linecount: Number,
    nouns: Array,
    adjectives: Array, 
    verbs: Array,
    formattedLines: String
       //add additional formation info later
});

module.exports = mongoose.model('stories', Story);
