const express = require("express");
const userRouter = express.Router();
const {getUsers} = require('../controllers/userController');




userRouter.get('/',getUsers);


module.exports = userRouter;