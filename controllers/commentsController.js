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
const Like=require('../models/like')
const { post } = require("../routes/comments");
const commentsMailer=require("../mailers/comments_mailer")


// module.exports.create =async function (req, res) {
//   let post=await Post.findById(req.body.post) 
//     if (post) {
//       let comment=await Comment.create({
//           content: req.body.content,
//           post: req.body.post,
//           user: req.user._id,
//          });
//          post.comments.push(comment);
//          post.save();
//          if (req.xhr){
//           // Similar for comments to fetch the user's id!
//           comment = await comment.populate('user', 'name').execPopulate();

//           return res.status(200).json({
//               data: {
//                   comment: comment
//               },
//               message: "Post created!"
//           });
//       }
//     }
      
   

// };
module.exports.create = async function(req, res){
  // console.log('****',req);

  try{
      let post = await Post.findById(req.body.post);

      if (post){
          let comment = await Comment.create({
              content: req.body.content,
              post: req.body.post,
              user: req.user._id
          });
          //  console.log('*******',comment);
          post.comments.push(comment);
          post.save();
         
        
          comment = await comment.populate('user', 'name email');
          commentsMailer.newComment(comment);
          if (req.xhr){
           
              
             
                return res.status(200).json({
                  data: {
                      comment: comment
                  },
                  message: "comment created!"
              });
          }


          req.flash('success', 'Comment published!');

          res.redirect('/');
      }
  }catch(err){
      req.flash('error', err);
      return;
  }
}
  
// module.exports.destroy=function(req,res){
//   Comment.findById(req.params.id,function (err,comment) { 
//     if(comment.user==req.user.id){
//       let postId=comment.post;
//       comment.remove();
//       req.flash('success','comment deleted');
//       Post.findByIdAndUpdate(postId,{$pull:{comment:req.params.id}},function(err,post){
      
//          return res.redirect('back');
//       })
//     }else{
//       return res.redirect('back');
//     }
       

    
//   })
// }
module.exports.destroy = async function(req, res){

  try{
      let comment = await Comment.findById(req.params.id);

      if (comment.user == req.user.id){

          let postId = comment.post;

           comment.remove();

          let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
          await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
        
          // send the comment id which was deleted back to the views
          if (req.xhr){
              return res.status(200).json({
                  data: {
                      comment_id: req.params.id
                  },
                  message: "cOMMENT deleted"
              });
         
          }


          req.flash('success', 'Comment deleted!');

          return res.redirect('back');
      }else{
          req.flash('error', 'Unauthorized');
          return res.redirect('back');
      }
  }catch(err){
      req.flash('error', err);
      return;
  }
  
}
