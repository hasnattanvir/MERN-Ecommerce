const express = require("express");
const userRouter = express.Router();
const {isLoggedIn, isLoggedOUt,isAdmin} = require("../middlewares/auth");
const {
        getUsers,
        getUserById,
        updateUserById,
        deleteUserById,
        // handleBanUserId,
        // handleUnBanUserId,
        handleManageUserId,
        processRegister,
        activateuserAccount
} = require('../controllers/userController');

const upload = require("../middlewares/uploadefile");
const {validateUserRegistration} = require("../validators/auth");
const runValidation = require("../validators");

userRouter.post(
        '/process-register',
        runValidation,
        isLoggedOUt,
        validateUserRegistration,
        upload.single("image"),
        processRegister
        );
userRouter.post('/activate',isLoggedOUt,activateuserAccount);
userRouter.get('/',isLoggedIn,isAdmin,getUsers);
userRouter.get('/:id',isLoggedIn,getUserById);
userRouter.delete('/:id',isLoggedIn,deleteUserById);
userRouter.put('/:id',upload.single("image"),isLoggedIn,updateUserById);
userRouter.put('/manage-user/:id',isLoggedIn,isAdmin,handleManageUserId);
//safarat ban and unban
// userRouter.put('/ban-user/:id',isLoggedIn,isAdmin,handleBanUserId);
// userRouter.put('/unban-user/:id([0-9a-fA-F]{24})',isLoggedIn,isAdmin,handleUnBanUserId);

module.exports = userRouter;