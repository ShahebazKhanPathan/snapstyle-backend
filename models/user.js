// Load mongoose module
const mongoose = require('mongoose');

// Create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    mobile: {
        type: Number,
        minlength: 10,
        maxlength: 10,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true
    }
});

// Create model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;