const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user')
//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true      
    },
    function(req,email,password,done){
        //find a user and estabish
        User.findOne({email:email},function(err,user){
            if(err){
                // console.log('error is in passport',err);
                req.flash('error',err);
                return done(err);
            }
            if(!user || user.password!=password){
                // console.log('invalid user name password');
                 req.flash('err','invalid username/password');
                return done(null,false)
            }
            return done(null,user);

        })
    }
));
//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});
//deserializing the user from the key in cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error is in passport',err);
            return done(err);
        }
        return done(null,user);
        
    })
});
//check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if the user is signed in then pass the request to the next function that is (controllers action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in 
    return res.redirect('/users/sign_in');

}
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current the signed in user from the sesson cookie and we are just sending it to the locals for the views
        res.locals.user=req.user;
    }
    next();
}
module.exports=passport;      