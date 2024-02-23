const express = require("express");
const productRouter = express.Router();
const {isLoggedIn, isLoggedOUt,isAdmin} = require("../middlewares/auth");
const {uploadProductImage} = require("../middlewares/uploadefile");
const runValidation = require("../validators");
const {
    handleCreateProduct,
} = require('../controllers/productController');
const { validateProduct } = require("../validators/product");

// POST:api/products
productRouter.post(
        '/',
        uploadProductImage.single('image'),
        validateProduct,
        runValidation,
        isLoggedIn,
        isAdmin,
        handleCreateProduct
        );

module.exports = productRouter;