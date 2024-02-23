const {body} = require("express-validator");
//registration validation
const validateProduct = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required")
    .isLength({min:3, max:150})
    .withMessage("Product Name should be at least 3-150 characters long"),  
    
    body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({min:3})
    .withMessage("Product description should be at least 3-150 characters long"),

    body("price")
    .trim()
    .notEmpty()
    .isFloat({min:0})
    .withMessage("Price must be a positive number"),

    body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

    body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({min:1})
    .withMessage("Quantity must be a positive integer")
];



module.exports = {
    validateProduct,
};

