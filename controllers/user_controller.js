const User=require('../models/user')
const fs=require('fs');
const path=require('path')
module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){

        return res.render('users',{
            title:'users',
            profile_user:user
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