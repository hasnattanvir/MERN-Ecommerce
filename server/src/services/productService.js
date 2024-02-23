const slugify = require('slugify')
const Product = require('../models/productModel');
const createError = require('http-errors');
const { deleteImage } = require('../helper/deleteImage');

// Register Product
const createProduct = async(productData,image)=>{
    // console.log(productData);
    // console.log(image);
    if(!image){
        throw createError(400,'Image file is required');
    }
    if(image.size > 1024 * 1024 *2){
        throw createError(400,'File too large.It must be less then 2 MB');
    } 
    if(image){
        productData.image = image;
        // console.log(image);
    }
    const productExists = await Product.exists({name:productData.name});
    if(productExists){
        throw createError(409,'Product with this name already exits')
    }
    //product create
    const product = await Product.create({
        name:productData.name,
        slug:slugify(productData.name),
        description:productData.description,
        price:productData.price,
        quantity:productData.quantity,
        shipping:productData.shipping,
        category:productData.category,
        image:productData.image
    })

    return product;
};


// Get Products
const getProducts = async(page=1,limit=4)=>{
    const products = await Product.find({})
        .populate('category')
        .skip((page-1)*limit)
        .limit(limit)
        .sort({createdAt:-1});
        if(!products){
            throw createError(404,'no products found');
        }
    const count = await Product.find({}).countDocuments();
    return {products,count};
};


// Get Product
const getProduct = async(slug)=>{
    const product = await Product.findOne({slug}).populate('category');
    if(!product){
        throw createError(404,'No Products Found');
    }
    return product;
};

// update Product
const updateProduct = async(slug,updates,image,updateOption)=>{
    if(updates.name){
        updates.slug = slugify(updates.name);
    }
    if(image){
        if(image.size>1024*1024*2){
            throw new Error ('File too large. It must be less than 2 MB');
        }
        updates.image = image.buffer.toString('base64');
    }
    const updateProduct = await Product.findOneAndUpdate(
        {slug},
        updates,
        updateOption
    );
    if(!updateProduct){
        throw createError(404,'User with this ID does not exist');
    }
    
    return updateProduct;
};

// Delete Product
const deleteProduct = async(slug)=>{
    const product = await Product.findOneAndDelete({slug});
    if(!product){
        throw createError(404,'No Products Found');
    }
    if(product.image){
        await deleteImage(product.image);
    }
    return product;
};

module.exports ={
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};