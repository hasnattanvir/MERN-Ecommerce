const createError = require('http-errors');
const users = require('../models/userModel');

const getUsers =(req,res,next)=>{
    console.log("user profile");
    try{
        res.status(200).send({
            message:"api user testing is working",
            users:users
        });
    }catch(error){
        // res.status(500).send(message.error);
        next(error);
    }
};


module.exports ={getUsers};