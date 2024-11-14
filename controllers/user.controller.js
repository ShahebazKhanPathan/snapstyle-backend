// Load required modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Load user model
const User = require('../models/user');

// Controller function to fetch all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User
            .find()
            .select("_id name email mobile")
        res.send(users);
    }
    catch (err) {
        next(err);
    }
}

// Controller function for user sign in
const signInUser = async (req, res, next) => {
    const data = req.body;
    try {
        const user = await User.findOne({ email: data.email });
        const isValid = bcrypt.compare(data.password, user.password);
        const token = jwt.sign({ id: user._id }, process.env.SNAPSTYLE_PRIVATE_KEY);

        if (isValid) {
            res.status(200).json({
                statusCode: 200,
                message: "Authentication successfull",
                token: token
            });
        }
        else {
            res.status(404).json({
                statusCode: 404,
                message: "Invalid email or password"
            });
        }
    }
    catch (err) {
        next(err);
    }
}

// Controller function to create a new user
const createNewUser = async (req, res, next) => {
    const data = req.body;

    const { error } = validateUser(data);
    if (error) return res.status(400).send(error.message);

    const checkAlreadyExist = await User.find({ email: data.email });
    if (checkAlreadyExist.length > 0) return res.status(409).send('Email or mobile already exists.');

    const complexity = passwordComplexity().validate(data.password);
    if (complexity.error) return res.status(400).send(complexity.error.message);
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    try {
        const user = new User({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            password: hashedPassword
        });
        const newUser = await user.save();
        
        const token = jwt.sign({ id: newUser._id }, process.env.SNAPSTYLE_PRIVATE_KEY);
        res.status(201).send(token);
    }
    catch (err) {
        next(err);
    }
}

// Function to validate a new user
const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(100).required(),
        mobile: Joi.string().pattern(new RegExp('^[0-9]{10}$')),
        password: Joi.string().min(8).max(100).required()
    });

    return schema.validate(data);
}

// Export controller functions
module.exports = { getAllUsers, createNewUser, signInUser };