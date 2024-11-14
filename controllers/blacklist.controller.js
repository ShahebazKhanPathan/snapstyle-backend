// Load required modules
const jwt = require("jsonwebtoken");

// Load blacklist model
const Blacklist = require('../models/blacklist');
const Cart = require("../models/cart");

// Controller function to validate a token
const checkTokenExpiry = async (req, res, next) => {
    const token = req.header("auth-token") ? req.header("auth-token") : req.header("admin-auth-token");

    try {
        const isBlacklisted = await Blacklist.findOne({ token: token });
        if (isBlacklisted) return res.status(409).send('Token has expired.');
        
        const decoded = jwt.verify(token, process.env.SNAPSTYLE_PRIVATE_KEY);
        const user = await Cart.find({ uId: decoded.id });
        res.status(201).json({ cartItemsCount: user.length > 0 ? user[0].items.length : 0 });
    }
    catch (err) {
        next(err);
    }
};

// Controller function to invalidate the token
const invalidateToken = async (req, res, next) => {
    const token = req.header("auth-token") ? req.header("auth-token") : req.header("admin-auth-token");
    const blacklistToken = new Blacklist({ token: token });
    try {
        const result = await blacklistToken.save();
        res.status(201).send(result);
    }
    catch (err) {
        next(err);
    }
};

// Export the controller functions
module.exports = { checkTokenExpiry, invalidateToken }