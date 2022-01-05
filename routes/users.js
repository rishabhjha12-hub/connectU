const express=require('express');
const router=express.Router();
const passport=require('passport');
const usersController=require('../controllers/user_controller');
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign_up',usersController.signup)
router.get('/sign_in',usersController.signin)
router.post('/create',usersController.create)
//use passport as a middlware to authenticate
router.post('/createSession',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign_in'},
),usersController.createSession);
router.get('/sign_out',usersController.signOut);

module.exports=router;