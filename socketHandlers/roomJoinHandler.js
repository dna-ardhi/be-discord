const serverStore = require('../serverStore');
const roomsUpdate = require('./updates/rooms');

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;

  const participantsDetails = {
    userId: socket.user.userId,
    socketId: socket.id,
  };

  const roomDetails = serverStore.getActiveRoom(roomId);
  serverStore.joinActiveRoom(roomId, participantsDetails);

  roomsUpdate.updateRooms();
};

module.exports = roomJoinHandler;
