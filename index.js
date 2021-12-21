const express=require('express');
const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const path =require('path')
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport_local_strategy')
const cookieParser=require('cookie-parser');
app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static('./assets'))
app.set('view engine','ejs')
 app.set('views','./views');
 app.use(session({
     name:'connectRJ',
     //todo change secret when deploying
     secret:'blahlah',
     saveUninitialized:false,
     resave:false,
     cookie:{
         maxAge:(1000*60*100)
     }

 }));
 app.use(passport.initialize());
 app.use(passport.session());
// app.set('views', path.join(__dirname, './views'))
//exract styles and scripts from the subpages to the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
//using express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        // console.log("error is ",err);
        console.log(`error in running the server: ${err}`);
    }
    console.log("server is up and running at ",port);
    
});