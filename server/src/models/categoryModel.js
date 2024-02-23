const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true,'Category name is missing'],
    trim: true,
    unique:true,
    minlength: [3, 'The length of category name can be minimum 3 characters'],
    maxlength: [31, 'The length of category name can be maximum 31 characters']
  },
  slug: {
    type: String,
    required: [true,'Category name is missing'],
    trim: true,
    lowercase:true,
    unique:true,
  },
 
},
{timestamps:true}
);

const Category = model('Category', categorySchema);
module.exports =  Category;
