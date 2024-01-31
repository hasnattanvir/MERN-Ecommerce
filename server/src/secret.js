require("dotenv").config();
const serverPost = process.env.SERVER_PORT || 3002;
const MongoDBAtlas = process.env.DB_URL || 'mongodb://localhost:27017/ecommerch';

const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/short_logo.png';
// console.log(MongoDBAtlas);

module.exports ={serverPost, MongoDBAtlas, defaultImagePath}