const Post=require('../models/post');
const Comment=require('../models/comment');
module.exports.create=function(req,res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    },function(err,post){
        if(err){
            console.log('error',err);
            req.flash('error',err);

            return;
        }
        req.flash('success','post published');

        // console.log(post);
        return res.redirect('back');
    }); 

}
//we can use both like above code callback method or like below code async await
module.exports.destroy=async function(req,res){
    try{
        const post=await Post.findById(req.params.id);
         //.id means converting  object id it into the string
        if(post.user==req.user.id){
            req.flash('success','post deleted');
            post.remove();
            
           
            await Comment.deleteMany({post:req.params.id})
             return res.redirect('back');
            
        }

    }
    catch(err){
        console.log('error',err);
        return;
    }
    
        



  
}