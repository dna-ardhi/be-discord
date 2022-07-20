const User = require('../../models/users');
const Invitation = require('../../models/friendInvitation');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postInvite = async (req, res) => {
  const { targetEmail } = req.body;
  const { userId, email } = req.user;

  if (email.toLowerCase() === targetEmail.toLowerCase()) {
    return res
      .status(409)
      .send('Sorry. you cannot become friend with yourself');
  }

  const targetUser = await User.findOne({
    email: targetEmail.toLowerCase(),
  });

  if (!targetUser) {
    return res
      .status(404)
      .send(
        `Friend of ${targetEmail} has not been found. Please check email address.`
      );
  }

  //  check if invitation has been already sent

  const invitationAlreadyReceive = await Invitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceive) {
    return res.status(409).send('Invitation has been already sent!');
  }

  // check if the user which we would like to invite is already our friend
  const userAlreadyFriends = targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );

  if (userAlreadyFriends) {
    return res
      .status(409)
      .send('Friend already added. Please check friends list');
  }

  // create new invitation in database
  const newInvitation = await Invitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // send pending invitation update to specific user
  friendsUpdate.updateFriendsPendingInvitations(targetUser._id.toString());

  return res.status(201).send('Invitation has been sent!');
};

module.exports = postInvite;
