const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtaccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {

      // Log the entire req.cookies object
    //   console.log('req.cookies:', req.cookies);
  
      const token = req.cookies.accessToken;
    //   console.log('Token:', token);
  
      if (!token) {
        throw createError(401, 'Access token not found, Please Login again');
      }
      const decoded = jwt.verify(token,jwtaccessKey);
    //   console.log(decoded);
    if(!decoded){
        throw createError(401,'Invalid access token Please again');
    }
    // req.body.userId = decoded._id;
    req.user = decoded.user;
    next();
  
      // ... rest of the middleware
  
    } catch (error) {
      return next(error);
    }
};

  
const isLoggedOUt = async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
    
      if (token) {
       try {
        const decoded = jwt.verify(token,jwtaccessKey);
        if(decoded){
          throw createError(401, 'User is already logged in');
        }
       } catch (error) {
          throw error;
       }
      }

    next();
    } catch (error) {
      return next(error);
    }
};


const isAdmin = async (req, res, next) => {
    try {
      // const token = req.cookies.accessToken;
      // console.log("req.user=",req.user.isAdmin);
    if(!req.user.isAdmin){
      throw createError(403, 'Forbidden. You must be an admin to access this resource');
    }

    next();
    } catch (error) {
      return next(error);
    }
};
  
  

module.exports = { isLoggedIn,isLoggedOUt,isAdmin };