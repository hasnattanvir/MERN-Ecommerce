const data = require('../data');
const User = require('../models/userModel');

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

module.exports = {seedUser};