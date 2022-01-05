const Post=require('../models/post');
const User=require('../models/user');
module.exports.home= function(req,res){
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
        // console.log("post",posts)
        User.find({},function(err,users){
            console.log('user',users)
            return res.render('home',{
                title:'connectRJ home',
                posts:posts,
                all_users:users
            });

        })

          
        })
    
    
}
// module.exports.about=function(req,res){
//     return res.end('<h1>about</h1>')
// }