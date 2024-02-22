const {body} = require("express-validator");
//registration validation
const validateUserRegistration = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({min:3, max:31})
    .withMessage("Name Name should be at least 3-31 characters long"),

    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min:6, max:31})
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage("Password should contain at letast one uppercase letter, one lowercase letter, one number, and one special character"),

    body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({min:3})
    .withMessage("Address should be at least 6 characters long"),

    body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required"),

    body("image")
    .optional()
    .isString()
    .withMessage('Image is required')
];


const validateUserLogin = [
     body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min:6, max:31})
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage("Password should contain at letast one uppercase letter, one lowercase letter, one number, and one special character"),

];

const validateUserPasswordUpdate = [
   body("oldPassword")
   .trim()
   .notEmpty()
   .withMessage("Old Password is required")
   .isLength({min:6, max:31})
   .matches(
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
   )
   .withMessage("Password should contain at letast one uppercase letter, one lowercase letter, one number, and one special character"),
   
   body("newPassword")
   .trim()
   .notEmpty()
   .withMessage("New Password is required")
   .isLength({min:6, max:31})
   .matches(
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
   )
   .withMessage("Password should contain at letast one uppercase letter, one lowercase letter, one number, and one special character"),
  
   body('confirmPassword').custom((value,{req})=>{
    if(value !== req.body.newPassword){
        throw new Error("Password Did't match");
    }
    return true;
   })
   
];


const validateUserForgetPassword = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];


const validateUserResetPassword = [
    body("token")
    .trim()
    .notEmpty()
    .withMessage("Token is Missing"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min:6, max:31})
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage("Password should contain at letast one uppercase letter, one lowercase letter, one number, and one special character"),
];

// const validateRefreshToken = [
//     body("token")
//     .trim()
//     .notEmpty()
//     .withMessage("Token is Missing"),
// ];


module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUserPasswordUpdate,
    validateUserForgetPassword,
    validateUserResetPassword,
    // validateRefreshToken
};

