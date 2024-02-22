const express = require("express");
const categoryRouter = express.Router();
const {isLoggedIn, isLoggedOUt,isAdmin} = require("../middlewares/auth");
const upload = require("../middlewares/uploadefile");
const {validateUserRegistration, validateUserPasswordUpdate, validateUserForgetPassword, validateUserResetPassword} = require("../validators/auth");
const runValidation = require("../validators");

const {
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory
} = require('../controllers/categoryController');
const { validateCategory } = require("../validators/category");


//POST api/categories

categoryRouter.post(
        '/',
        validateCategory,
        runValidation,
        isLoggedIn,
        isAdmin,
        handleCreateCategory
        );

//GET api/categories
categoryRouter.get(
        '/',
        handleGetCategories
        );

//GET api/categories/single
categoryRouter.get(
        '/:slug',
        handleGetCategory
        );

//PUT api/categories/single-update
categoryRouter.put(
        '/:slug',
        validateCategory,
        runValidation,
        isLoggedIn,
        isAdmin,
        handleUpdateCategory
        );

module.exports = categoryRouter;