const express = require("express");
const productRouter = express.Router();
const {isLoggedIn, isLoggedOUt,isAdmin} = require("../middlewares/auth");
const {uploadProductImage} = require("../middlewares/uploadefile");
const runValidation = require("../validators");
const {
    handleCreateProduct,
    handleGetProducts,
    handleGetProduct,
    handleDeleteProduct,
    handleUpdateProduct
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

// Get:api/products
productRouter.get(
        '/',
        handleGetProducts
        );

// Get:api/products/single
productRouter.get(
        '/:slug',
        handleGetProduct
        );

// Delete:api/products/:slug
productRouter.delete(
        '/:slug',
        isLoggedIn,
        isAdmin,
        handleDeleteProduct
        );

// Update:api/products/:slug
productRouter.put(
        '/:slug',
        uploadProductImage.single('image'),
        isLoggedIn,
        isAdmin,
        handleUpdateProduct
        );

module.exports = productRouter;