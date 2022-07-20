const Users = require('../../models/users');
const FriendInvitation = require('../../models/friendInvitation');
const serverStore = require('../../serverStore');

const updateFriendsPendingInvitations = async (userId) => {
  try {
    const pendingInvitation = await FriendInvitation.find({
      receiverId: userId,
    }).populate('senderId', '_id username email');

    // find all active connection of specific userId
    const receiverList = serverStore.getActiveConnections(userId);
    const io = serverStore.getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit('friend-invitation', {
        pendingInvitations: pendingInvitation ? pendingInvitation : [],
      });
    });
    // find if user of specified userId has active connections
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateFriendsPendingInvitations,
};
