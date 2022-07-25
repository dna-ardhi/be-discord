const serverStore = require('../serverStore');

const createRoomHandler = (socket) => {
  const socketId = socket.id;
  const userId = socket.user.userId;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId);

  socket.emit('room-create', {
    roomDetails,
  });
};

module.exports = createRoomHandler;
