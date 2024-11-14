// Create an express router
const router = require("express").Router();

// Load authorization middleware
const authUser = require("../middleware/authUser");

// Load controller functions
const { getAllUsers, createNewUser, signInUser } = require("../controllers/user.controller");

// Create routes
router.get('/', getAllUsers);
router.post('/', createNewUser);
router.post("/sign-in", signInUser);

// Export the router
module.exports = router;