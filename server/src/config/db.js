const mongoose = require("mongoose");
const {MongoDBAtlas} = require('../secret');
const logger = require("../controllers/loggerController");

const connectDB = async (options = {}) =>{
    try{
        await mongoose.connect(MongoDBAtlas,options);
        logger.log('info',"Connection to DB is Successfully established");
        mongoose.connection.on('error',()=>{
        logger.log('error','DB connection error:',error);
        })
    }catch(error){
        logger.log('error','could not connect to DB:',error.toString);
    }
};

module.exports = connectDB;

