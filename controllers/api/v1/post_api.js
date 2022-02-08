const Post=require('../../../models/post')
const Comment=require('../../../models/comment')
module.exports.index=async function(req,res){
    let posts=await Post.find({}).populate('user')
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate: {
                path: 'user'
            }
        })
    return res.json(200,{
        message:"list of posts",
        posts:posts
    })
}
module.exports.destroy=async function(req,res){
    try{
        const post=await Post.findById(req.params.id);
         //.id means converting  object id it into the string

         if(post.user==req.user.id){
              
            post.remove();
            
           
            await Comment.deleteMany({post:req.params.id})
            
            
             return res.json(200,{
                 message:'posts and associated comments deleted succesfully'
             })

         }else{
             res.json(401,{
                 message:"you cannot delete this post!"
             })
         }
       
          
            
    
        


    }
    catch(err){
        console.log(err)
       
        return res.json(500,{
            message:'internal server error'
        });
    }
    
        



  
}