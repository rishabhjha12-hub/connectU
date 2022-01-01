const Post=require('../models/post')
module.exports.home=function(req,res){
    // return res.end('<h1>express is running for connectRJ</h1>')
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title:'connectRJ home',
    //         posts:posts
    //     });
        
    // })
    //populate the name for the post of user
    Post.find({}).populate('user')
    .populate({
        path:'comments',
        populate: {
            path: 'user'
        }
    }).populate({
        path:'user'
    })
    .exec(function(err,posts){
            return res.render('home',{
                title:'connectRJ home',
                posts:posts
            });
        })
    
    
}
// module.exports.about=function(req,res){
//     return res.end('<h1>about</h1>')
// }