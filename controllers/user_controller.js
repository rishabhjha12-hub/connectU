const User=require('../models/user')
const fs=require('fs');
const path=require('path')
const Friendship=require('../models/friendship')
 const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('../config/nodemailer');
module.exports.profile=async function(req,res){
    let isFriend=false;
    let friends1=await Friendship.findOne({ from_user:req.params.id,to_user:req.user.id})
    let friends2=await Friendship.findOne({ from_user:req.user.id,to_user:req.params.id})
    if(friends1 || friends2){
        isFriend=true;
    }
    User.findById(req.params.id,function(err,user){

        return res.render('users',{
            title:'users',
            profile_user:user,
            isFriend:isFriend
        });
    })
   
}
module.exports.update=async function(req,res){
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         return res.redirect('back')
    //     })
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }
   
    if(req.user.id==req.params.id){
        let user=await User.findById(req.params.id);
        try{
           
            User.uploadedAvatar(req,res,function(err){
                if(err) {console.log('******multer error',err);}
                console.log('request for file',req.file);
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    //     //this is saving the path of the uploaded file into the avatar field in the user
                     user.avatar=User.avatarPath+'/'+req.file.filename

                    
                    
                }
                user.save();
                return res.redirect('back');
               
            })
        }
        catch(err){
            // if(err.code==='ENOENT'){
            //     console.log('i can update here')
            //     return res.redirect('back');
            // }
            console.log("error code",err.code)
            if(err.code === 'ENOENT'){
                
                // this is saving the path of the uploaded file into the avatar field in the user
                user.avatar = User.avatarPath + '/' + req.file.filename;
                user.save();  // Important
                req.flash('success', 'Updated!');
                return res.redirect('back');
            }
            console.log('error catch',err);
            return res.redirect('back');
        }

    }
    else{
            return res.status(401).send('Unauthorized');
    }
}
//render the signup page
module.exports.signup=function(req,res){
    if(req.isAuthenticated()){
         return res.redirect('/users/profile')
    }
  
    return res.render('user_sign_up',{
        title:'connrctRJ signup'
    })
}
//render the signin page
module.exports.signin=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in',{
        title:'connrctRJ signin'
    })
}
//get the signup data 
module.exports.create=function(req,res){
   
    if(req.body.password!=req.body.confirmPassword){
        
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('error in signing up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error in signing up',err);
                    return;
                }
                req.flash('success','signup done')
                return res.redirect('/users/sign_in');
            })

        }
        else{
            
           return res.redirect('back');
        
        }
    })

}
//get the signin data
module.exports.createSession=function(req,res){
   req.flash('success','logged in succesfully!');
    return res.redirect('/')
    
}
// module.exports.failure_createSession=function(req,res){
//     req.flash('err','invalid username/password')
//     console.log('signin failure')
//     return res.redirect('back')
// }
module.exports.signOut=function(req,res){
   
    req.logout();
    req.flash('success','You are logged out!')
    return res.redirect('/')
    
}
//change new
module.exports.forgotPassword = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash('error', "You are already Signed in!");
        return res.redirect('back');
    }
    return res.render('user_reset_password', { title: 'nocial | Forgot Password' });
}

module.exports.resetPassword = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            req.flash('error', "You are already Signed in!");
            return res.redirect('back');
        }
        const resetToken = req.params.token;
        if(resetToken){
            return res.render('user_new_password', { title: 'nocial | Change Password', token: resetToken });
        }
        const token = crypto.randomBytes(32).toString('hex');
        const user = await User.findOne({email: req.body.email});
        user.resetToken = token;
        user.expireToken = Date.now() + 600000;
        await user.save();

        nodemailer.transporter.sendMail({
            to: req.body.email,
            from: "no-reply@nocial.com",
            subject: "Reset Password",
            html: `<h5>Click <a href="http://localhost:8000/users/reset-password/${token}">here</a> to create new password</h5>`
        },(err, info) => {
            if(err) { console.log('Error in sending mail: ', err); return; }

        console.log("Message Sent");
            return;
        });
        req.flash('success', "Link sent");
        return res.redirect('back');

    } catch (e) {
        console.log(e);
        req.flash('error', e);
        return res.redirect('back');
    }
}

module.exports.newPassword = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            req.flash('error', "You are already Signed in!");
            return res.redirect('back');
        }
        const token = req.body.token;
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;

        if (password != confirmPassword) {
            req.flash('error', "Enter same password");
            return res.redirect('back');
        }

        const user = await User.findOne({ resetToken: token });
        if(user.expireToken > Date.now()){
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);
            user.save();

            user.resetToken = '';
            user.expireToken = Date.now();
            req.flash('success', "Password Updated");
            return res.redirect('/users/sign_in');
        }
        req.flash('error', "Session Expired");
        return res.redirect('/users/forgot-password');

    } catch (e) {
        console.log(e);
        req.flash('error', e);
        return res.redirect('back');
    }
};