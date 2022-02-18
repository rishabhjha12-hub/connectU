const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development={
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'blahlah',
    db:'connectRJ_development',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'rishabhjha0@gmail.com',
            pass:''
        }
    },
     google_client_id:"1009821999258-ttt1n5405mv4jpjdup5sd8526b456d2d.apps.googleusercontent.com",
     google_client_secret:"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",
     google_call_back_url:"http://localhost:8000/users/auth/google/callback",
     jwt_Secret:'codeial',
     morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.ASSET_PATH,
    session_cookie_key: process.env.CODIEAL_SESSION_COOKIE_KEY,
    db: process.env.CONNECTRJ_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODIEAL_GMAIL_USER_NAME,
            pass: process.env.  CODIEAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODIEAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODIEAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_Secret: 'codeial',
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



//module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.CODIEAL_ENVIORNMENT);
module.exports=production