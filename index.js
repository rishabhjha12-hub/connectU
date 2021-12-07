const express=require('express');
const app=express();
const port=8000;

//using express router
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err){
        // console.log("error is ",err);
        console.log(`error in running the server: ${err}`);
    }
    console.log("server is up and running at ",port);
    
});