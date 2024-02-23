const slugify = require('slugify')
const Product = require('../models/productModel');
const createError = require('http-errors');

// Register Product
const createProduct = async(productData)=>{
    const {name,description,price,quantity,shipping,category,image} = productData;
    const productExists = await Product.exists({name:name});

    if(productExists){
        throw createError(409,'Product with this name already exits')
    }
    //product create
    const product = await Product.create({
        name:name,
        slug:slugify(name),
        description:description,
        price:price,
        quantity:quantity,
        shipping:shipping,
        image:image.filename,
        category:category
    })

    return product;
};

// Get Categories
const getProducts = async()=>{
    return await Product.find({}).select('name slug').lean();
};

// Get Product
const getProduct = async(slug)=>{
    return await Product.find({slug}).select('name slug').lean();
};

// update Product
const updateProduct = async(name,slug)=>{
     const filter = {slug};
     const updates =  {$set:{name:name,slug:slugify(name)}};
     const option = {new:true};
     const updateProduct = await Product.findOneAndUpdate(
        filter,
        updates,
        option,
        );
    
    return updateProduct;
};

// Delete Product
const deleteProduct = async(slug)=>{
    const result = await Product.findOneAndDelete({slug});
    return result;
};

module.exports ={
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};