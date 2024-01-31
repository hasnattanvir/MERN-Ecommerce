require("dotenv").config();
const serverPost = process.env.SERVER_PORT || 3002;
const MongoDBAtlas = process.env.DB_URL || 'mongodb://localhost:27017/ecommerch';
module.exports ={serverPost, MongoDBAtlas}