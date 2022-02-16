const express=require('express');
const router=express.Router();
const passport=require('passport');
const usersController=require('../controllers/user_controller');
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign_up',usersController.signup)
// router.get('/failure',usersController.failure_createSession)
router.get('/sign_in',usersController.signin)

router.post('/create',usersController.create)
//use passport as a middlware to authenticate
router.post('/createSession',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign_in'},
),usersController.createSession);
router.get('/sign_out',usersController.signOut);
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:"/users/sign-in"}),usersController.createSession)
router.get('/forgot-password', usersController.forgotPassword);
router.post('/reset-password', usersController.resetPassword);
router.get('/reset-password/:token', usersController.resetPassword);
router.post('/new-password', usersController.newPassword);
module.exports=router;