const User=require('../../../models/user');
const jwt=require('jsonwebtoken')
const env=require('../../../config/enviornment')
module.exports.createSession=async function(req,res){
    try{
        let user=await User.findOne({email:req.body.email});
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message:"inavalid user name or password"
            });
        }
        return res.json(200,{
            message:"sign in successfully here is your token plz keep it is safe",
            data:{
                token:jwt.sign(user.toJSON(),env.jwt_Secret,{expiresIn:'100000'})
            }
        })

    }catch(err){
        console.log('error',err);
        return res.json(500,{
            message:"internal server error"
        })

    }
    
   
     
 }