const express = require("express");
const runValidation =require('../validators');
const {handleLogin,handleLogout} = require("../controllers/authController");
const { isLoggedOUt, isLoggedIn } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post("/login",isLoggedOUt,handleLogin);
authRouter.post("/logout",isLoggedIn,handleLogout);




module.exports = authRouter;