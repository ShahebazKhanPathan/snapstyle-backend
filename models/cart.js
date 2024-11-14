// Load mongoose module
const mongoose = require('mongoose');

// Create schema
const cartSchema = new mongoose.Schema({
    uId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        new mongoose.Schema({
            pId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, require: true },
            price: { type: Number, require: true },
            photo: { type: String, require: true }
        })
    ]
});

// Create model
const Cart = mongoose.model('Cart', cartSchema);

// Export the model
module.exports = Cart;