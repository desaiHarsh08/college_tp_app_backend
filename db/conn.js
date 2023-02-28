const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env'})

// Connection strings
console.log(process.env.DATABASE)
const mongoURI = process.env.DATABASE;

mongoose.set("strictQuery", false); // Removes deprecated warnings

// Connect to MongoDB
const connectToMongo = ()=>{
    mongoose.connect(mongoURI, { useNewUrlParser: true }, ()=>{
        console.log('Connection Success!');
    });
};

module.exports = connectToMongo;