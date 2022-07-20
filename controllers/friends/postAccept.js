const FriendInvitation = require('../../models/friendInvitation');
const User = require('../../models/users');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(401).send('Error occurred. Please try again!');
    }

    const { senderId, receiverId } = invitation;

    // add friends to both users
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    // update list of the friends if the users are online

    // update list of pending friends invitations
    friendsUpdate.updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send('Friend successfully added!');
  } catch (error) {
    console.log(error);
    return res(500).send('Something went wrong. Please try again later!');
  }
};

module.exports = postAccept;
