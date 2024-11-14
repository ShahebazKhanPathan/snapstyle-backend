// Load required modules
const jwt = require('jsonwebtoken');

// Controller function for admin sign-in
const adminSignIn = (req, res, next) => {
    const { userId, password } = req.body;
   
    try {
        if (userId == process.env.ADMIN_USER_ID && password == process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ id: userId, isAdmin: true}, process.env.SNAPSTYLE_PRIVATE_KEY);
            return res.status(201).send(token);
        }
        return res.status(404).send('Invalid credentials.');
    }
    catch (err) {
        next(err);
    }
}

// Export the controller functions
module.exports = { adminSignIn };
