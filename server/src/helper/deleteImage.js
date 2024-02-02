const fs = require('fs').promises;

const deleteImage = async (userImagePath)=>{
    try{
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        await console.log("user image was deleted");
        await fs.unlink(userImagePath);
    }catch(error){
        console.error('user image does not exist')
    }
    // fs.access(userImagePath)
    //    .then(()=>fs.unlink(userImagePath))
    //    .then(()=>console.log("user image was deleted"))
    //    .catch((err)=>console.error('user image does not exist'));
}

module.exports = {deleteImage};