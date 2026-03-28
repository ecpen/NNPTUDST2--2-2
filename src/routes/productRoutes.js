const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { validateProduct, validateQuery } = require("../middlewares/validate");

// GET /api/products?page=1&limit=10&minPrice=100&maxPrice=500&slug=dien-thoai-samsung
router.get("/", validateQuery, productController.getProducts);

// GET /api/products/:slug
router.get("/:slug", productController.getProductBySlug);

// POST /api/products
router.post("/", validateProduct, productController.createProduct);

// PUT /api/products/:slug
router.put("/:slug", validateProduct, productController.updateProduct);

// DELETE /api/products/:slug
router.delete("/:slug", productController.deleteProduct);

module.exports = router;
