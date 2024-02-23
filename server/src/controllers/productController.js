const Product = require('../models/productModel');
const slugify = require('slugify')
const createError = require('http-errors');
const { successResponse } = require('./responseController');
const { createProduct, getProducts, getProduct,updateProduct,deleteProduct } = require('../services/productService');
// console.log("test");

// Register Product
const handleCreateProduct = async(req,res,next)=>{
    try{
        const {name,description,price,quantity,shipping,category} = req.body;
        const image = req.file;
        if(!image){
            throw createError(400,'Image file is required');
        }
        if(image.size > 1024 * 1024 *2){
            throw createError(400,'File too large.It must be less then 2 MB');
        } 

        const productData = {
            name,description,price,category,quantity,shipping,image
        }
        const product = await createProduct(productData);
        

        return successResponse(res,{
            statusCode:201,
            message:'Product was created successfully',
            payload: {product}
        })
    }catch(error){
        next(error);
    }
};





module.exports ={
    handleCreateProduct,
};