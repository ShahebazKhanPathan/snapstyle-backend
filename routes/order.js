// Load required modules
const { join } = require("path");
const Order = require("../models/order");

// Create an express router
const router = require("express").Router();

// Load authorization middleware
const auth = require('../middleware/authUser');

// Load controller functions
const { createNewOrder, createOrderByCart, verifyPayment, getOrders, getOrderByUserId } = require("../controllers/order.controller");

// Create routes
router.get("/", auth, getOrderByUserId);
router.post('/', auth, createNewOrder);
router.post("/create", auth, createOrderByCart);
router.post("/payment-verify", )
router.get("/admin", auth, getOrders);
router.post("/payment-verify", verifyPayment);
router.get("/payment-success", (req, res) => {
    res.sendFile(join(__dirname, "success.html"));
});

// Export the router
module.exports = router;