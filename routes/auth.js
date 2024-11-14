// Create an express router
const router = require('express').Router();

// Load controller functions
const { authUser } = require("../controllers/auth.controller");

// Create the routes
router.post('/', authUser);

// Export the router
module.exports = router;