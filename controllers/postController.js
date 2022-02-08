const Post=require('../models/post');
const Comment=require('../models/comment');
const Like=require('../models/like')
module.exports.create=async function(req,res){
    try{
        let post=await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        if(req.xhr){
             // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
             post = await post.populate('user', 'name')
             console.log(post)
            return res.status(200).json({
                data:{
                    post:post
                  
                    
                },
                message:"post created!"
                
                
               
            })
        }
        
    
         req.flash('success','post published');
    
            // console.log(post);
        return res.redirect('back');
    }catch(err){
        req.flash(err);
        return res.redirect('back')
    }
       

   
}
//we can use both like above code callback method or like below code async await
module.exports.destroy=async function(req,res){
    try{
        const post=await Post.findById(req.params.id);
         //.id means converting  object id it into the string
        if(post.user==req.user.id){
            await Like.deleteMany({likeable:post,onModel:'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});
            req.flash('success','post deleted');
            post.remove();
            
           
            await Comment.deleteMany({post:req.params.id})
            if(req.xhr){
                

                return res.status(200).json({
                    data:{
                        post_id:req.params.id,
                        
                        
                    },
                    message:"post deleted!"
                   
                })
            }
            
            
             return res.redirect('back');
            
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }


    }
    catch(err){
        console.log('error',err);
        return;
    }
    
        



  
}