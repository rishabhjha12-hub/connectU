const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
passport.use(new googleStrategy({
        clientID:"1009821999258-ttt1n5405mv4jpjdup5sd8526b456d2d.apps.googleusercontent.com","project_id":"connectrj",
        clientSecret:"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",
        callbackURL:"http://localhost:8000/users/auth/google/callback",
    },
    function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log(err);
                return;
            }
            console.log(profile);
            if(user){
                return done(null,user)
            }else{
                User.create({
                    name:profile.name,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toLocaleString('hex')
                },function(err,user){
                    if(err){
                        console.log(err);
                        return;
                    }
                    return done(null,user)

                })
            }
        })
    }
))
module.exports=passport;