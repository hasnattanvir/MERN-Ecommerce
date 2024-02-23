const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require("../secret");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is missing'],
    trim: true,
    unique:true,
    minlength: [3, 'The length of Product name can be minimum 3 characters'],
    maxlength: [150, 'The length of Product name can be maximum 31 characters']
  },
  slug: {
    type: String,
    required: [true, 'Product name is missing'],
    trim: true,
    lowercase:true,
    unique:true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [3, 'The length of Product Description can be minimum 3 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    trim: true,
    validate:{
        validator:function(v){
         v>0
        },
        message:(props)=>{
            `${props.value} is not a valid price! price must be greater then 0`;
        }
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    trim: true,
    validate:{
        validator:function(v){
         v>0
        },
        message:(props)=>{
            `${props.value} is not a valid quantity! quantity must be greater then 0`;
        }
    }
  },
  sold: {
    type: Number,
    required: [true, 'Sold is required'],
    trim: true,
    default:0,
    validate:{
        validator:function(v){
         v>0
        },
        message:(props)=>{
            `${props.value} is not a valid Sold! Sold quantity must be greater then 0`;
        }
    }
  },
  shipping:{
    type:Number,
    default:0 // shipping free o or paid
  },
  image: {
    type: String,
    default:defaultImagePath
  },
  category:{
    type:Schema.Types.ObjectId,
    ref:'Category',
    required:true
  }

},
{timestamps:true}
);

const Product = model('Product', productSchema);
module.exports = Product;
