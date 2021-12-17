const express=require('express');
const router=express.Router();
const usersController=require('../controllers/user_controller');
router.get('/profile',usersController.profile)
router.get('/sign_up',usersController.signup)
router.get('/sign_in',usersController.signin)
router.post('/create',usersController.create)

module.exports=router;