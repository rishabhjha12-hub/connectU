// const Comment=require('../models/comment');
// const Post=require('../models/post')
// module.exports.create=function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(err){
//             console.log('error',err);
//             return;
//         }
//         if(post){
//             Comment.create({
//                 content:req.body.content,
//                 post:req.body.post,
//                 user:req.user._id,

//             },function(err,comment){
//                 if(err){
//                     console.log('error',err);
//                     return;
//                 }
//                 post.comments.push(comment);
//                 post.save();
//                res.redirect('/')

//             })
//         }
//     })
// }
const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = function (req, res) {
  Post.findById(req.body.post, function (err, post) {
      console.log("working too")
      console.log(post);
    if (post) {
      Comment.create(
        {
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        },
        function (err, comment) {
          // handle error
          console.log(comment);

          post.comments.push(comment);
          post.save();

          res.redirect("/");
        }
        
      );
      
    }
  });
};

