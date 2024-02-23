const Product = require('../models/productModel');
const slugify = require('slugify')
const createError = require('http-errors');
const { successResponse } = require('./responseController');
const { createProduct, getProducts, getProduct,updateProduct,deleteProduct } = require('../services/productService');
// console.log("test");

// Register Product
const handleCreateProduct = async(req,res,next)=>{
    try{
        const image = req.file?.path;
        console.log(image);
        const product = await createProduct(req.body,image);

        return successResponse(res,{
            statusCode:201,
            message:'Product was created successfully',
            payload: {product}
        })
    }catch(error){
        next(error);
    }
};

// Find Product
const handleGetProducts = async(req,res,next)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const productData = await getProducts(page,limit);

        return successResponse(res,{
            statusCode:200,
            message:'Product was fatched successfully',
            payload:{
                products:productData.products,
                pagination:{
                    totalPage:Math.ceil(productData.count/limit),
                    currentPage:page,
                    previousPage:page-1,
                    nextPage:page+1,
                    totalNumberOfProducts:productData.count,
                }
            }
        })
    }catch(error){
        next(error);
    }
};

// Find Product Slug
const handleGetProduct = async(req,res,next)=>{
    try{
        const {slug} = req.params;
        const product = await getProduct(slug);
        // console.log(product);
        return successResponse(res,{
            statusCode:200,
            message:'Return Single Producte',
            payload:{product}
        })
    }catch(error){
        next(error);
    }
};

// Delete Product By Slug
const handleDeleteProduct = async(req,res,next)=>{
    try{
        const {slug} = req.params;
        await deleteProduct(slug);
        return successResponse(res,{
            statusCode:200,
            message:'Producte Delete success',
        })
    }catch(error){
        next(error);
    }
};

// Update Product By Slug
const handleUpdateProduct = async(req,res,next)=>{
    try{
        const {slug} = req.params;
        const updateOption = {new:true, runValidators:true, context:'query'};
        let updates = {};
        const allowedFields = ['name','description','price','sold','quantity','shipping'];

        for(const key in req.body){
            if(allowedFields.includes(key)){
                updates[key] = req.body[key];
            }
        }
        const image = req.file;

        const updatedProduct =  await updateProduct(slug,updates,image,updateOption)

       

        return successResponse(res,{
            statusCode:200,
            message:'Producte Update success',
            payload:{updatedProduct}
        })
    }catch(error){
        next(error);
    }
};





module.exports ={
    handleCreateProduct,
    handleGetProducts,
    handleGetProduct,
    handleDeleteProduct,
    handleUpdateProduct
};