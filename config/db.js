// Load mongoose module
const mongoose = require('mongoose');

// Function to create database connection
const db = () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log('MongoDB connection established'))
            .catch((err) => console.log('Error: ', err));
    }
    catch (err) {
        console.log('catch error: ', err);
    }   
}

// Export connection variable
module.exports = db;