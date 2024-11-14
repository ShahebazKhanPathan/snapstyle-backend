// Load controller functions
const {
    getAllProducts,
    getProductByID,
    getProductByCategory,
    getProductBySearch,
    createNewProduct,
    deleteProduct
} = require("../controllers/product.controller");

// Create an express router
const router = require("express").Router();

// Create routes
router.get("/", getAllProducts);
router.get("/:id", getProductByID);
router.post("/", createNewProduct);
router.get("/category/:id", getProductByCategory);
router.get("/search/:query", getProductBySearch);
router.delete("/:id", deleteProduct);

// Export the router
module.exports = router;