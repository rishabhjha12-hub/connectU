const nodeMailer=require('../config/nodemailer');
//same as 
//modeule.exports=new comment()
//this is another way of exporting
exports.newComment=(comment)=>{
    // console.log("inside mail ",comment);
     let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
     console.log("*****html string",htmlString)
    nodeMailer.transporter.sendMail({

        from:"rishabhjha0@gmail.com",
        to:comment.user.email,
        subject:"new comment published",
        //  html:"<h1>comment is posted</h1>"
         html:htmlString
        

    },(err,info)=>{
        if(err){
            console.log("error in sendng mail",err);
            return;
        }
        console.log("mail sent",info);
        return;



    })
}