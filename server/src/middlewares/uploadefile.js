const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

const File_Max_Size = Number(process.env.MAX_FILE_SIZE) || 2097152;
const FileTypeAllow = process.env.ALLOWED_FILE_TYPES || ['jpg','jpeg','png'];

const UPLOAD_DIR = process.env.UPLOAD_FILE || 'public/images/users';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_DIR)
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
    if(!FileTypeAllow.includes(extname.substring(1))){
      const error = createError(400,'File Type Not Allowed');
      return cb(error);
    }
    cb(null,true);
  }
  
  const upload = multer({ 
    storage: storage, 
    limits:{fileSize: File_Max_Size},
    fileFilter,
  });

  module.exports = upload;