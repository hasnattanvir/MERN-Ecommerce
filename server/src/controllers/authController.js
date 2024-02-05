const handleLogin = async(req,res,next)=>{
    try {
        // login/email,password .req.body
        const {email,password}= req.body
        //esExist
        //compare the password
        //user banned ?
        //token,cookie
    } catch (error) {
        next(error);
    }
}

module.exports = handleLogin;