const express=require('express');
const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const path =require('path')
const db=require('./config/mongoose');
require('./config/view-helpers')(app);
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport_local_strategy');
const passportJwt=require('./config/passport-jwt-strategy');
const googlePassport=require('./config/passport-google-oauth-strategy')
const cookieParser=require('cookie-parser');
const sassMiddleware=require('node-sass-middleware');
const MongoStore=require('connect-mongo')
const flash=require('connect-flash');
const customMware=require('./config/middelware');
const env=require('./config/enviornment')
const logger=require('morgan')
// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
//CHANGE
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declarat




if(env.name=='development'){
    app.use(sassMiddleware({
        src:path.join(__dirname,env.asset_path,'scss'),
        dest:path.join(__dirname,env.asset_path,'css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
    }));

}

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static(env.asset_path))
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));
app.set('view engine','ejs')
 app.set('views','./views');
 app.use(session({
     name:'connectRJ',
     //todo change secret when deploying
     secret:  env.session_cookie_key,
     saveUninitialized:false,
     resave:false,
     cookie:{
         maxAge:(1000*60*100)
     },
     store: MongoStore.create(
         {
         mongoUrl:'mongodb://localhost/connectRJ_development',
         autoRemove:'disabled'
         },
         function(err){
             console.log("error is ",err);
         }

     )

 }));
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(passport.setAuthenticatedUser);
 app.use(flash());
 app.use(customMware.setFlash);
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