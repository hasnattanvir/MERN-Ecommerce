const express = require("express");
const userRouter = express.Router();
const {getUsers,getUserById,deleteUserById,processRegister,activateuserAccount} = require('../controllers/userController');
const upload = require("../middlewares/uploadefile");

userRouter.post('/process-register',upload.single("image"),processRegister);
userRouter.post('/verify',activateuserAccount);
userRouter.get('/',getUsers);
userRouter.get('/:id',getUserById);
userRouter.delete('/:id',deleteUserById);
module.exports = userRouter;