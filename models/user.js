const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVTAR_PATH=path.join('/uploads/users/avatar')
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    //changed
    gender:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    friends: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship' 
        }
    ],
    resetToken: {
        type: String
    },
    expireToken: {
        type: Date
    }

},{
    timestamps:true
});
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..',AVTAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
//static functions
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath=AVTAR_PATH;
const User=mongoose.model('User',userSchema);
module.exports=User;