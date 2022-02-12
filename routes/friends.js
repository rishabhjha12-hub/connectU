const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsController = require('../controllers/friends_controller');

router.get('/add-friend/:id', passport.checkAuthentication, friendsController.addFriend);
// router.put('/:id/accept', passport.authenticate('jwt', { session: false }), friendsController.accept);
// router.delete('/:id/remove', passport.authenticate('jwt', { session: false }), friendsController.remove);

module.exports = router;