const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator();
const auth = require('../middleware/auth');
const friends = require('../controllers/friends');

const postFriendInvitationSchema = Joi.object({
  targetEmail: Joi.string().email(),
});

router.post(
  '/invite',
  auth,
  validator.body(postFriendInvitationSchema),
  friends.controllers.postInvite
);

module.exports = router;
