// Create an express router
const router = require('express').Router();

// Load authorization middleware
const auth = require('../middleware/authUser');

// Load controller functions
const { checkTokenExpiry, invalidateToken } = require("../controllers/blacklist.controller");

// Create routes
router.get('/', checkTokenExpiry);
router.delete('/', auth, invalidateToken);

// Export the router
module.exports = router;