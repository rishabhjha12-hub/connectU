const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;
const User=require('../models/user');
const env=require('./enviornment')
let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:env.jwt_Secret
}
passport.use(new JWTStrategy(opts,function(jwtPayload,done){
    User.findById(jwtPayload._id,function(err,user){
        if(err){
            console.log(err);
            return;
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    })
}))
module.exports=passport;