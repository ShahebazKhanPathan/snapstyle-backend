// Load required modules
const jwt = require('jsonwebtoken');
const Razorpay = require("razorpay");
var { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");

// Load order and user model
const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');

// Controller function to create a new order
const createNewOrder = async (req, res, next) => {
    const token = req.header('auth-token');

    try {
        const decodedToken = jwt.verify(token, process.env.SNAPSTYLE_PRIVATE_KEY);
        const {
            name,
            email,
            mobile,
            address,
            pId,
            pTitle,
            pImage,
            pPrice,
            pTaxes,
            pShippingCharges,
            pTotal
        } = req.body;

        const order = new Order({
            uid: decodedToken.id,
            userName: name,
            email: email,
            mobile: mobile,
            address: address,
            pId: pId,
            title: pTitle,
            image: pImage,
            price: pPrice,
            taxes: pTaxes,
            shippingCharges: pShippingCharges,
            total: pTotal,
            date: new Date()
        });

        const result = await order.save();
        res.send(result);
    }
    catch (err) {
        next(err);
    }
    
};

// Controller function to create a new order by cart
const createOrderByCart = async (req, res, next) => {

    const token = req.header("auth-token");
    const decodedToken = jwt.verify(token, process.env.SNAPSTYLE_PRIVATE_KEY);
    try {
        // Create razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const { items, totalAmount, totalPrice, totalTaxes,  currency, notes, receipt } = req.body;

        // Create order options
        const options = {
            amount: totalAmount * 100,
            currency,
            receipt,
            notes
        }

        // Create an order
        const order = await razorpay.orders.create(options);
        console.log(order);
        
        const result = new Order({
            uId: decodedToken.id,
            orderId: order.id,
            orderStatus: order.status,
            totalPrice: totalPrice,
            totalTaxes: totalTaxes,
            totalAmount: totalAmount,
            items: items
        }).save();

        res.json(order);
    }
    catch (err) {
        res.status(err.statusCode).json(err);
    }
}

const verifyPayment = async (req, res, next) => {

    const decodedToken = jwt.verify(req.header("auth-token"), process.env.SNAPSTYLE_PRIVATE_KEY);

    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;

        const isValidPayment = validatePaymentVerification({ order_id: razorpay_order_id, payment_id: razorpay_payment_id }, razorpay_signature, secret);
        if (isValidPayment) {
            console.log("Payment verification successfull!");
            const updateOrder = await Order.findOneAndUpdate({ orderId: razorpay_order_id }, { orderStatus: "success" });
            const updateCart = await Cart.deleteMany({ uId: decodedToken.id });
            res.status(200).json({ status: "ok" });
        }
        else {
            console.log("Payment verification failed!");
            res.status(400).json({ status: "verification_failed" });
        }
    }
    catch (err) {
        res.status(500).json({ status: "error", message: "Error verifying payment" });
        console.log(err);
    }
}

// Controller function to fetch all orders
const getOrders = async (req, res, next) => {
    const token = req.header("admin-auth-token");

    try {
        const decodedToken = jwt.verify(token, process.env.SNAPSTYLE_PRIVATE_KEY);
        const result = await Order.find();
        res.send(result);
    }
    catch (err) {
        next(err);
    }
};

// Controller function to fetch order details by user id
const getOrderByUserId = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.header("auth-token"), process.env.SNAPSTYLE_PRIVATE_KEY);
        const result = await Order.find({ uId: decodedToken.id });
        res.status(200).json({
            statusCode: 200,
            message: "Orders fetched successfully",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
};

module.exports = { createNewOrder, getOrders, getOrderByUserId, createOrderByCart, verifyPayment };