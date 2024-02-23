const data = require('../data');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const seedUser = async(req,res,next)=>{
    try{
        //deleteing all existing use
        await User.deleteMany({});
        //insert new  use
        const users = await User.insertMany(data.users);
        //successful response
        // console.log(users);
        return res.status(201).json(users);
    }catch(error){
        next(error);
    }
};

const seedProducts = async(req,res,next)=>{
    try{
        //deleteing all existing use
        await Product.deleteMany({});
        //insert new  use
        const products = await Product.insertMany(data.products);
        //successful response
        // console.log(users);
        return res.status(201).json(products);
    }catch(error){
        next(error);
    }
};

module.exports = {seedUser,seedProducts};