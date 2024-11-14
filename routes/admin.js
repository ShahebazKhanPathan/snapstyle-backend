// Create a router
const router = require('express').Router();

// Load controller functions
const { adminSignIn } = require("../controllers/admin.controller");

// Create routes
router.post("/", adminSignIn);

// Export the router
module.exports = router;