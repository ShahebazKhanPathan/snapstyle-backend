// Load required modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Load user model
const User = require('../models/user');

// Load authorization middleware
const auth = require('../middleware/authUser');

// Controller function to authenticate the user
const authUser = () => async (req, res, next) => {
    const data = req.body;

    const { error } = validateUser(data);
    if (error) return res.status(400).send(error.message);
    
    try {
        const queryUser = await User.findOne({ email: data.email }).select('_id password');
        if (queryUser==null) return res.status(404).send('Invalid email or password');
        
        const verifyPassword = await bcrypt.compare(data.password, queryUser.password);
        if (!verifyPassword) return res.status(404).send('Invalid email or password');

        const token = jwt.sign({ id: queryUser._id }, process.env.SNAPSTYLE_PRIVATE_KEY);
        res.status(201).send(token);
    }
    catch (err) {
        next(err);
    }
}

// Function to validate a user
const validateUser = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(100).required(),
        password: Joi.string().min(8).max(100).required()
    });

    return schema.validate(data);
}

module.exports = { authUser };