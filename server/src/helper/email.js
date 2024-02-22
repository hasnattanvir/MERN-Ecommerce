const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
const logger = require("../controllers/loggerController");

// console.log(" i am hasnat");
// console.log(smtpUsername);
// console.log(smtpPassword);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const EmailWithNodeMailer = async(emailData)=>{
    try{
        const mailOptions ={
            from: smtpUsername, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        };
    
        const info = await transporter.sendMail(mailOptions);
        logger.log('info','Message sent :%s', info.response);
    }catch(error){
        logger.log('error','Error occured while sending email',error);
        throw error;
    };
}

module.exports = EmailWithNodeMailer;
