// Load mongoose module
const mongoose = require('mongoose');

// Create schema
const orderSchema = new mongoose.Schema({
    uId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, required: true },
    orderStatus: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    totalTaxes: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    items: [
        new mongoose.Schema({
            pId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            photo: { type: String, required: true }
        })
    ]
});

// const orderSchema = new mongoose.Schema({
//     uid: { type: String, required: true },
//     userName: { type: String, required: true },
//     email: { type: String, required: true },
//     mobile: { type: Number, required: true },
//     address: { type: String, required: true },
//     pId: { type: String, required: true },
//     title: { type: String, required: true },
//     image: { type: String, required: true },
//     price: { type: Number, required: true },
//     taxes: { type: Number, required: true },
//     shippingCharges: { type: Number, required: true },
//     total: { type: Number, required: true },
//     date: { type: String, required: true }
// });

// Create model
const Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;