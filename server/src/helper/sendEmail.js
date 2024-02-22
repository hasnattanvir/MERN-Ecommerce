const createError = require("http-errors");
const EmailWithNodeMailer = require("./email");
const sendEmail = async (emailData) =>{
    try{
        await EmailWithNodeMailer(emailData);
       }catch(emailError){
        throw createError(500,'Failed to send verification email');
       }

}

module.exports = sendEmail;