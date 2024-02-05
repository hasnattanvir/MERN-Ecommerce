const express = require("express");
const userRouter = express.Router();
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
        validateUserRegistration,
        upload.single("image"),
        processRegister
        );
userRouter.post('/activate',activateuserAccount);
userRouter.get('/',getUsers);
userRouter.get('/:id',getUserById);
userRouter.delete('/:id',deleteUserById);
userRouter.put('/:id',upload.single("image"),updateUserById);
module.exports = userRouter;