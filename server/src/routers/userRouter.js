const express = require("express");
const userRouter = express.Router();
const {isLoggedIn, isLoggedOUt} = require("../middlewares/auth");
const {
        getUsers,
        getUserById,
        updateUserById,
        deleteUserById,
        processRegister,
        activateuserAccount
} = require('../controllers/userController');

const upload = require("../middlewares/uploadefile");
const validateUserRegistration = require("../validators/auth");
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
userRouter.get('/',isLoggedIn,getUsers);
userRouter.get('/:id',isLoggedIn,getUserById);
userRouter.delete('/:id',isLoggedIn,deleteUserById);
userRouter.put('/:id',upload.single("image"),isLoggedIn,updateUserById);
module.exports = userRouter;