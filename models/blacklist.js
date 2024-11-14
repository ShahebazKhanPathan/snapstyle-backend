// Load mongoose module
const mongoose = require('mongoose');

// Create schema
const schema = new mongoose.Schema({
    token: { type: String, required: true }
});

// Create model
const Blacklist = mongoose.model('Blacklist', schema);

// Export the model
module.exports = Blacklist;