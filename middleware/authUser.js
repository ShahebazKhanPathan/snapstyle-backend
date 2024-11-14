// Load required modules
const jwt = require('jsonwebtoken');

// Load blacklist model
const Blacklist = require('../models/blacklist');

// Middleware function to validate token
const auth = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send('Unauthorized access.'); 

    try {
        const isBlacklisted = await Blacklist.findOne({ token: token });
        if (isBlacklisted) return res.status(409).send('Token expired.');
        next();
    }
    catch (err) {
         next(err);
    }
}

// Export the middleware function
module.exports = auth;