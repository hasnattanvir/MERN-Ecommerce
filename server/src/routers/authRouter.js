const express = require("express");
const runValidation =require('../validators');
const {handleLogin,handleLogout,handleRefreshToken,handleProtectedRoute} = require("../controllers/authController");
const { isLoggedOUt, isLoggedIn } = require("../middlewares/auth");
const { validateUserLogin, validateRefreshToken} = require("../validators/auth");
const authRouter = express.Router();

authRouter.post("/login",validateUserLogin,runValidation,isLoggedOUt,handleLogin);
authRouter.post("/logout",isLoggedIn,handleLogout);
authRouter.get(
    '/refresh-token',
    // validateRefreshToken,
    // runValidation,
    handleRefreshToken
    );

authRouter.get(
    '/protected',
    // validateRefreshToken,
    // runValidation,
    handleProtectedRoute
    );



module.exports = authRouter;