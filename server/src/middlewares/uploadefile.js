const multer = require('multer');
const path = require('path');
const createError = require('http-errors');
const { UPLOAD_USER_IMG_DIR, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require('../config');

// const File_Max_Size = Number(process.env.MAX_FILE_SIZE) || 2097152;
// const FileTypeAllow = process.env.ALLOWED_FILE_TYPES || ['jpg','jpeg','png'];
// const UPLOAD_DIR = process.env.UPLOAD_FILE || 'public/images/users';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_USER_IMG_DIR)
    },
    filename: function (req, file, cb) {
      const extname= path.extname(file.originalname);
      cb(
        null,
        Date.now()+"_"+file.
        originalname.replace(extname,'') + extname);
    }
  })

  const fileFilter =(req,file,cb)=>{
    const extname= path.extname(file.originalname);
    if(!ALLOWED_FILE_TYPES.includes(extname.substring(1))){
      // const error = new Error('File Type Not Allowed');
      return cb(new Error('File Type Not Allowed'),false);
    }
    cb(null,true);
  }
  
  const upload = multer({ 
    storage: storage, 
    limits:{fileSize: MAX_FILE_SIZE},
    fileFilter,
  });

  module.exports = upload;