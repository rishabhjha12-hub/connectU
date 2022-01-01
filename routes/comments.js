const express=require('express');
const passport=require('passport');
const router=express.Router();
const commentsController=require('../controllers/commentsController');
console.log("working")
router.post('/create',passport.checkAuthentication,commentsController.create);
module.exports=router;