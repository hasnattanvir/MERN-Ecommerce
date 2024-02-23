const multer = require('multer');
const path = require('path');
const createError = require('http-errors');
const { 
  ALLOWED_FILE_TYPES, 
  MAX_FILE_SIZE ,
  UPLOAD_USER_IMG_DIR,
  UPLOAD_PRODUCT_IMG_DIR, 
} = require('../config');

// when image use string format
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_USER_IMG_DIR)
    },
    filename: function (req, file, cb) {
      cb( null,Date.now() + '_' + file.originalname);
    }
})

// when image use string format
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_PRODUCT_IMG_DIR)
    },
    filename: function (req, file, cb) {
      cb( null,Date.now() + '_' + file.originalname);
    }
})

// when image use string format
const fileFilter =(req,file,cb)=>{
  if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
    return cb(new Error('File Type Not Allowed'),false);
  }
  cb(null,true);
}

const upload = multer({ 
  storage: storage, 
  limits:{fileSize: MAX_FILE_SIZE},
  fileFilter:fileFilter,
});

const uploadProductImage = multer({ 
  storage: productStorage, 
  limits:{fileSize: MAX_FILE_SIZE},
  fileFilter:fileFilter,
});

module.exports = {upload,uploadProductImage};