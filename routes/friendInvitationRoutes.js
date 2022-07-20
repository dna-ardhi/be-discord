const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator();
const auth = require('../middleware/auth');
const friends = require('../controllers/friends');

const postFriendInvitationSchema = Joi.object({
  targetEmail: Joi.string().email(),
});

const inviteDecisionSchema = Joi.object({
  id: Joi.string().required(),
});

router.post(
  '/invite',
  auth,
  validator.body(postFriendInvitationSchema),
  friends.controllers.postInvite
);

router.post(
  '/accept',
  auth,
  validator.body(inviteDecisionSchema),
  friends.controllers.postAccept
);

router.post(
  '/reject',
  auth,
  validator.body(inviteDecisionSchema),
  friends.controllers.postReject
);

module.exports = router;
