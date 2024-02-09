const express = require("express");
const userRouter = express.Router();
const {isLoggedIn, isLoggedOUt,isAdmin} = require("../middlewares/auth");
const upload = require("../middlewares/uploadefile");
const {validateUserRegistration, validateUserPasswordUpdate} = require("../validators/auth");
const runValidation = require("../validators");
const {
        handlegetUsers,
        handlegetUserById,
        handleupdateUserById,
        handledeleteUserById,
        // handleBanUserId,
        // handleUnBanUserId,
        handleManageUserId,
        handleprocessRegister,
        handleactivateuserAccount,
        handleUpdatePassword
} = require('../controllers/userController');



userRouter.post(
        '/process-register',
        isLoggedOUt,
        runValidation,
        validateUserRegistration,
        upload.single("image"),
        handleprocessRegister
        );
userRouter.post('/activate',isLoggedOUt,handleactivateuserAccount);
userRouter.get('/',isLoggedIn,isAdmin,handlegetUsers);
userRouter.get('/:id',isLoggedIn,handlegetUserById);
userRouter.delete('/:id',isLoggedIn,handledeleteUserById);
userRouter.put(
        '/:id',
        isLoggedIn,
        upload.single("image"),
        handleupdateUserById
        );
userRouter.put('/manage-user/:id',isLoggedIn,isAdmin,handleManageUserId);
userRouter.post(
        '/updatepassword/:id',
        validateUserPasswordUpdate,
        runValidation,
        isLoggedIn,
        handleUpdatePassword
        );
//safarat ban and unban
// userRouter.put('/ban-user/:id',isLoggedIn,isAdmin,handleBanUserId);
// userRouter.put('/unban-user/:id([0-9a-fA-F]{24})',isLoggedIn,isAdmin,handleUpdatePassword);

module.exports = userRouter;