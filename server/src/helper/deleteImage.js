const fs = require('fs').promises;

const deleteImage = async (imagePath)=>{
    try{
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        await console.log("image was deleted");
    }catch(error){
        console.error('image does not exist')
    }
    // fs.access(userImagePath)
    //    .then(()=>fs.unlink(userImagePath))
    //    .then(()=>console.log("user image was deleted"))
    //    .catch((err)=>console.error('user image does not exist'));
}

module.exports = {deleteImage};