const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    // remove that invitations from friends invitations collection
    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending invitation
    friendsUpdate.updateFriendsPendingInvitations(userId);
    return res.status(200).send('Invitation successfully rejected!');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong. Please try Again!');
  }
};

module.exports = postReject;
