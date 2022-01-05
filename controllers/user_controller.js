const User=require('../models/user')
module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){

        return res.render('users',{
            title:'users',
            profile_user:user
        });
    })
   
}
module.exports.update=function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back')
        })
    }else{
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
   
    return res.redirect('/')
    
}
module.exports.signOut=function(req,res){
    req.logout();
    return res.redirect('/')
    
}