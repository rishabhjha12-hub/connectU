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
const { post } = require("../routes/comments");

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
module.exports.destroy=function(req,res){
  Comment.findById(req.params.id,function (err,comment) { 
    if(comment.user==req.user.id){
      let postId=comment.post;
      comment.remove();
      Post.findByIdAndUpdate(postId,{$pull:{comment:req.params.id}},function(err,post){
      
         return res.redirect('back');
      })
    }else{
      return res.redirect('back');
    }
       

    
  })
}

