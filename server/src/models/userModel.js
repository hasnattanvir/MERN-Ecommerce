const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require("../secret");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is missing'],
    trim: true,
    minlength: [3, 'User Name can be minimum 3 char'],
    maxlength: [31, 'User Name can be maximum 31 char']
  },
  email: {
    type: String,
    required: [true, 'User email is missing'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'User password is missing'],
    minlength: [6, 'User Name can be minimum 6 char'],
    set:(v)=>bcrypt.hashSync(v,bcrypt.genSaltSync(10))
  },
  image: {
    type: String,
    default:defaultImagePath
    // contentType:String,
    // required:[true,"User image is required"],
  },
  phone: {
    type: String,
    required: [true, 'User password is missing'],
  },
  address: {
    type: String,
    minlength: [3, 'Address can be minimum 3 char'],
  },
  isAdmin: {
    type: Boolean,
    default:false,
  },
  isBanned: {
    type: Boolean,
    default:false,
  },
},
{timestamps:true}
);



const User = model('Users', userSchema);
module.exports =  User;
// 'User' is the model name, you can change it to your preference
