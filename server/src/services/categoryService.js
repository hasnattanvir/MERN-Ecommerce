const slugify = require('slugify')
const Category = require('../models/categoryModel');

// Register Category
const createCategory = async(name)=>{
    const newCategory = await Category.create({
        name:name,
        slug:slugify(name)
    })
    return newCategory;
};

// Get Categories
const getCategories = async()=>{
    return await Category.find({}).select('name slug').lean();
};

// Get Category
const getCategory = async(slug)=>{
    return await Category.find({slug}).select('name slug').lean();
};

// update Category
const updateCategory = async(name,slug)=>{
     const filter = {slug};
     const updates =  {$set:{name:name,slug:slugify(name)}};
     const option = {new:true};
     const updateCategory = await Category.findOneAndUpdate(
        filter,
        updates,
        option,
        );
    
    return updateCategory;

};

module.exports ={
    createCategory,
    getCategories,
    getCategory,
    updateCategory
};