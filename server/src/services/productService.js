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
const getProducts = async(page=1,limit=4, filter={})=>{
    const products = await Product.find(filter)
        .populate('category')
        .skip((page-1)*limit)
        .limit(limit)
        .sort({createdAt:-1});
        if(!products){
            throw createError(404,'no products found');
        }
    const count = await Product.find(filter).countDocuments();
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
const updateProduct = async(slug,req)=>{
    
    try {
        const product = await Product.findOne({slug:slug});
        // console.log(product);
        if(!product){
            throw createError(404,'Product Not Found');
        }
        const updateOptions = {new:true, runValidators:true, context:'query'};
        
        let updates = {};
        const allowedFields = ['name','description','price','sold','quantity','shipping'];
        
        for(const key in req.body){
            if(allowedFields.includes(key)){
                if(key === 'name'){
                    updates.slug=slugify(req.body[key]);
                }
                updates[key] = req.body[key];
            }
        }
        // console.log(updates);
        const image = req.file?.path;
        // console.log(image);
        if(image){
            if(image.size>1024 * 1024 *2){
                throw new Error(400,'File too large.It must be less then 2 MB');
            }
            // updates.image = image.buffer.toString('base64');
            updates.image = image;
            product.image !== 'default.png' && deleteImage (product.image);
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { slug },
            updates,
            updateOptions
        );
        if(!updatedProduct){
            throw createError(404,'Updateing Product was not possible');
        }
        return updatedProduct;
       
    } catch (error) {
        throw error;
    }
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