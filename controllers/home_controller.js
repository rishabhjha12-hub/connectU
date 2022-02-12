const Post=require('../models/post');
const User=require('../models/user');
const Friendship = require('../models/friendship');
// module.exports.home= function(req,res){
    // return res.end('<h1>express is running for connectRJ</h1>')
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title:'connectRJ home',
    //         posts:posts
    //     });
        
    // })
    //populate the name for the post of user
//     // return res.end('<h1>express is running for connectRJ</h1>')
//     // Post.find({},function(err,posts){
//     //     return res.render('home',{
//     //         title:'connectRJ home',
//     //         posts:posts
//     //     });
        
//     // })
//     //populate the name for the post of user
//     Post.find({}).populate('user')
//     .populate({
//         path:'comments',
//         populate: {
//             path: 'user'
//         }
//     }).populate({
//         path:'user'
//     })
//     .exec(function(err,posts){
//         // console.log("post",posts)
//         User.find({},function(err,users){
//             console.log('user',users)
//             return res.render('home',{
//                 title:'connectRJ home',
//                 posts:posts,
//                 all_users:users
//             });

//         })

          
//         })
    
    
// }
//we can use both like above code callback method or like below code async await same in comments and user controllers
module.exports.home= async function(req,res){
    
    //populate the name for the post of user
    try{
        let posts=await Post.find({}).populate('user')
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate: {
                path: 'user'
            },
            populate:{
                path:'likes'
            }
        }).populate('likes')
        let users = await User.find({});
        let friends = [];
        if(req.user){
            friends = await User.findById(req.user.id)
            .populate({
                path: "friends",
                populate: {
                    path: 'to_user from_user',
                    select: 'name'
                }
            });
        }
        return res.render('home', {
            title: "nocial | Home",
            posts: posts,
            all_users: users,
            friends: friends.friends,
          
        });

    }
    catch(err){
        console.log('error',err);
        return;
    }
  
    
}

// module.exports.about=function(req,res){
//     return res.end('<h1>about</h1>')
// }