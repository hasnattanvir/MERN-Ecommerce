const createHttpError = require('http-errors');
const User = require("../models/userModel");

const handleUserAction = async(action,userId)=>{
    try {
        //console.log('Action received:', action); // Add this line for debugging

        let update;
        let successMessage;

        if (action === 'ban') {
            update = { isBanned: true };
            successMessage = 'User Was Banned Success';
        } else if (action === 'unban') {
            update = { isBanned: false };
            successMessage = 'User Was Unbanned Success';
        } else {
            throw createHttpError(400, 'Invalid Action. Use ban or unban');
        }

        const updateOptions = {new:true, runvalidators:true, context:'query'}; 
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            update,
            updateOptions
            ).select("-password");
        if(!updatedUser){
            throw createError(400,'User was not Unbanned successfull');
        }
        return successMessage;
    }catch (error) {
        throw(error);
    }
}

module.exports = {handleUserAction};