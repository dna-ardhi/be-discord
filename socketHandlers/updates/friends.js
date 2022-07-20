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

const updateFriends = async (userId) => {
  try {
    // find active connections of specific id (online users)
    const receiverList = serverStore.getActiveConnections(userId);

    if (receiverList.length > 0) {
      const user = await Users.findById(userId, {
        _id: 1,
        friends: 1,
      }).populate('friends', '_id username email');

      if (user) {
        const friendsList = user.friends.map((friend) => {
          return {
            id: friend._id,
            email: friend.email,
            username: friend.username,
          };
        });

        // get io server instance
        const io = serverStore.getSocketServerInstance();
        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit('friend-list', {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (error) {}
};

module.exports = {
  updateFriendsPendingInvitations,
  updateFriends,
};
