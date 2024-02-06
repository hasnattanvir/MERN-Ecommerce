const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const {findWithID} = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { jwtactivationKey, clientURL } = require('../secret');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const EmailWithNodeMailer = require('../helper/email');
const { log } = require('console');

const getUsers = async(req,res,next)=>{
    // console.log("user profile");
    try{
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegExp = new RegExp('.*'+search+".*",'i');

        const filter = {
            isAdmin:{$ne: true},
            $or:[
                {name:{$regex:searchRegExp}},
                {email:{$regex:searchRegExp}},
                {phone:{$regex:searchRegExp}}
            ]
        };
        const options = {password:0}


        const users = await User.find(filter,options).limit(limit).skip((page-1)*limit);
        const count = await User.find(filter).countDocuments();
        if(!users) throw createError(404,"no users found");
        // res.status(200).send({
        //     message:"User was Return",
        //     users,
        //     pagination:{
        //         totalPages:Math.ceil(count/limit),
        //         currentPage:page,
        //         previousPage:page-1 > 0 ? page-1:null,
        //         nextPage:page+1 <= Math.ceil(count/limit) ? page+1:null,
        //     }
        // });

        return successResponse(res,{
            statusCode:200,
            message:'Users Were Returned successfully',
            payload:{
                message:"User was Return",
                users,
                pagination:{
                    totalPages:Math.ceil(count/limit),
                    currentPage:page,
                    previousPage:page-1 > 0 ? page-1:null,
                    nextPage:page+1 <= Math.ceil(count/limit) ? page+1:null,
                }
            }
        })
    }catch(error){
        // res.status(500).send(message.error);
        next(error);
    }
};


const getUserById = async(req,res,next)=>{
    try{
        // console.log(req.body.userId);
       const id = req.params.id;
       const options ={password:0};
       const user = await findWithID(User,id,options);
    //    const options = {password:0};
    //    //
    //    const user = await User.findById(id,options);
    //    //
    //    if(!user){
    //     throw createError(404,"User does not exist with this id");
    //    }
        return successResponse(res,{
            statusCode:200,
            message:'User Were Returned successfully',
            payload:{user},
        })
    }catch(error){
        //
        // res.status(500).send(message.error);
        // if(error instanceof mongoose.Error){
        //     next(createError(400,'Invalid User Id'));
        //     return;
        // };
        next(error);
    }
};


const deleteUserById = async(req,res,next)=>{
    try{
       const id = req.params.id;
       const options ={password:0};
       const user = await findWithID(User,id,options);
       const userImagePath = user.image;
       deleteImage(userImagePath);

    //option 2
    //    fs.access(userImagePath)
    //    .then(()=>fs.unlink(userImagePath))
    //    .then(()=>console.log("user image was deleted"))
    //    .catch((err)=>console.error('user image does not exist'));

    //option 1
    //    fs.access(userImagePath,(err)=>{
    //        if(err){
    //         console.error('user image does not exist');
    //        }else{
    //         fs.unlink(userImagePath,(err)=>{
    //             if(err){
    //                 throw err;
    //             }else{
    //                 console.log("user image was deleted");
    //             }
    //         })
    //        }
    //    })

       await User.findByIdAndDelete({_id:id,isAdmin:false})
       if(user && user.image){
        await deleteImage(user.image);
       }

        return successResponse(res,{
            statusCode:200,
            message:'User Wes Delete successfully',
            // payload:{user},
        })
    }catch(error){
        next(error);
    }
};


const processRegister = async(req,res,next)=>{
    try{
        const {name,email,password,phone,address} = req.body;
        // added new
        const image = req.file?.path;
        if(image && image.size>1024 * 1024 *2){
            throw createError(400,'File too large.It must be less then 2 MB');
        } 

        const userExists = await User.exists({email:email});
        if(userExists){
            throw createError(409,'User already exits. please login');
        }

        const tokenPayload = {
            name,
            email,
            password,
            phone,
            address,
        }
        if(image){
            tokenPayload.image = image
        }

        const token = createJSONWebToken(
            tokenPayload,
            jwtactivationKey,
            '10m'
            );
        
        //prepare email
        const emailData = {
            email,
            subject:'Account Activation Email',
            html:`
            <h2>Hello ${name} ! </h2>
            <p>Please click here to link <a href="${clientURL}/api/users/activate/${token}" target="_blank">activate your account</a></p>
            `
        }
        //send email
       try{
        await EmailWithNodeMailer(emailData);
       }catch(emailError){
        next(createError(500,'Failed to send verification email'));
        return;
       }

        return successResponse(res,{
            statusCode:200,
            message:`Please go to your email ${email}  for completing your registerton process`,
            payload:token,
        })
    }catch(error){
        next(error);
    }
};



const activateuserAccount = async(req,res,next)=>{
    try{
        const token = req.body.token;
        if(!token) {
            throw createError(404, 'token not found');
        }

        try{
            const decoded = jwt.verify(token,jwtactivationKey);
            // console.log(decoded);
            if(!decoded) throw createError(401,'user was not able to verified');
            const userExists = await User.exists({email:decoded.email});
            if(userExists){
                throw createError(409,'User already exits. please login');
            }
            await User.create(decoded);
            return successResponse(res,{
                statusCode:201,
                message:`user was registered successfully`,
            })

        }catch(error){
            if(error.name === 'TokenExpiredError'){
                throw createError(401,'Token has Expired');
            }else if(error.name==='JsonWebTokenError'){
                throw createError(401,'Invalid Token');
            }else{
                throw error;
            }
        }
    }catch(error){
        next(error);
    }
};

const updateUserById = async(req,res,next)=>{
    try{

        const userId = req.params.id;
        const options ={password:0};
        const user = await findWithID(User,userId,options);

        const updateOptions = {new:true, runvalidators:true, context:'query'}; 
        let updates = {};
        const allowedFields = ['name','password','phone','address'];
        for(let key in req.body){
            if(allowedFields.includes(key)){
                updates[key] = req.body[key];
            }else if(key==='email'){
                // throw new Error("email can't update");
                throw createError(400,"email can't update");
            }
        } 
        const image = req.file.path; 
        if(image){
            if(image && image.size>1024 * 1024 *2){
                throw createError(400,'File too large.It must be less then 2 MB');
            }
            // updates.image = image.buffer.toString('base64');
            updates.image = image;
            user.image !== 'default.png' && deleteImage (user.image);
        }
        
        //object to field exclude
        // delete updates.email;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
            ).select("-password");
        if(!updatedUser){
            throw createError(404,'File too large.It must be less then 2 MB');
        }

        return successResponse(res,{
            statusCode:200,
            message:'user was update successfully',
            payload:updatedUser,
        });

    }catch(error){
        next(error);
    }
};



module.exports ={getUsers,getUserById,deleteUserById,processRegister,activateuserAccount,updateUserById};