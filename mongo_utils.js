const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//const uri = process.env.MONGODB_URI
const uri = process.env.MONGODB_URI||'mongodb://heroku_96jgxn96:2cmgf46k5k6q8i52f3m0m6v7jb@ds161134.mlab.com:61134/heroku_96jgxn96'


const db = mongoose.connect(uri);
const client =  db.connection;
module.exports = client;
