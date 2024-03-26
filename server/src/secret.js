require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3002;
const MongoDBAtlas = process.env.DB_URL || 'mongodb://localhost:27017/ecommerch';

const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/short_logo.png';
// console.log(MongoDBAtlas);

const jwtactivationKey = process.env.JWT_ACTIVATION_KEY || 'slkjfeonvls34(*@#&$';
const jwtaccessKey = process.env.JWT_ACCESS_KEY || 'SLFKLJK987(*@#&$';
const jwtresetPassKey = process.env.JWT_Reset_Password_KEY || 'slklsdkfj@##$)@AU(*@#&$';
const jwtrefressKey = process.env.JWT_Refreshd_KEY || '@##$)@AU(*@#&$';
const smtpUsername = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';

// const clientURL = process.env.CLIENT_URL || '';
// const uploadDir = process.env.UPLOAD_FILE || '';
module.exports ={
    serverPort, 
    MongoDBAtlas, 
    defaultImagePath, 
    jwtactivationKey,
    jwtaccessKey,
    jwtresetPassKey,
    smtpUsername,
    smtpPassword,
    clientURL,
    jwtrefressKey,
    // uploadDir
}