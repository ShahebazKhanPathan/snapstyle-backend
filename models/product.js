// Load mongoose module
const mongoose = require('mongoose');

// Create schema for image data
const photoSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    size: { type: Number, required: true, min: 100 },
    type: { type: String, required: true }
});

// Create product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 10,
    },
    description: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 2000
    },
    photo: photoSchema
});

// Create model
const Product = mongoose.model('Product', productSchema);

// Export the model
module.exports = Product;