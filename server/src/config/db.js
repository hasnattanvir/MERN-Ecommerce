const mongoose = require("mongoose");
const {MongoDBAtlas} = require('../secret');

const connectDB = async (options = {}) =>{
    try{
        await mongoose.connect(MongoDBAtlas,options);
        console.log("Connection to DB is Successfully established");
        mongoose.connection.on('error',()=>{
        console.error('DB connection error:',error);
        })
    }catch(error){
        console.error('could not connect to DB:',error.toString);
    }
};

module.exports = connectDB;

