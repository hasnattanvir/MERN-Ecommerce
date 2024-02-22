const { successResponse } = require('./responseController');
const { createCategory, getCategories, getCategory,updateCategory,deleteCategory } = require('../services/categoryService');
const createError = require('http-errors');

// Register Category
const handleCreateCategory = async(req,res,next)=>{
    try{
        const {name} = req.body;
     
        const newCategory = await createCategory(name);
        return successResponse(res,{
            statusCode:201,
            message:'category was created successfully',
            payload: newCategory
        })
    }catch(error){
        next(error);
    }
};

// Get Categories
const handleGetCategories = async(req,res,next)=>{
    try{
       const categories = await getCategories();
        return successResponse(res,{
            statusCode:200,
            message:'category was find successfully',
            payload: categories
        })
    }catch(error){
        next(error);
    }
};

// Get Category/single
const handleGetCategory = async(req,res,next)=>{
    try{
       const {slug} = req.params;
       const category = await getCategory(slug);
       if(!category){
            throw createError(404,'Category Not Found');
        }
        return successResponse(res,{
            statusCode:200,
            message:'category was find successfully',
            payload: category
        })
    }catch(error){
        next(error);
    }
};

// Update Category/single
const handleUpdateCategory = async(req,res,next)=>{
    try{
       const {name} = req.body;
       const {slug} = req.params;
       const updatedcategory = await updateCategory(name,slug);
       if(!updatedcategory){
            throw createError(404,'No Category Found with this slug');
       }
        return successResponse(res,{
            statusCode:200,
            message:'category was update successfully',
            payload: updatedcategory
        })
    }catch(error){
        next(error);
    }
};

// Update Category/single
const handleDeleteCategory = async(req,res,next)=>{
    try{
       const {slug} = req.params;
       const deletecategory = await deleteCategory(slug);
       if(!deletecategory){
            throw createError(404,'No Category Found with this slug');
       }

       return successResponse(res,{
            statusCode:200,
            message:'category was Delete successfully',
        })
    }catch(error){
        next(error);
    }
};

module.exports ={
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory,
    handleDeleteCategory
};