// Create an express router
const router = require('express').Router();

// Load authorization middleware
const auth = require('../middleware/authUser');

// Load controller functions
const { addToCart, getCartItems, removeCartItem, } = require("../controllers/cart.controller");

// Create the routes
router.get("/", auth, getCartItems);
router.post("/", auth, addToCart);
router.delete("/:id", auth, removeCartItem);

// Export the router
module.exports = router