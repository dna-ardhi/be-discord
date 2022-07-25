const authSocket = require('./middleware/authSocket');
const disconnectHandler = require('./socketHandlers/disconnectHandler');
const newConnectionHandler = require('./socketHandlers/newConnectionHandler');
const serverStore = require('./serverStore');
const directMessageHandler = require('./socketHandlers/directMessageHandler');
const directChatHistoryHandler = require('./socketHandlers/directChatHistoryHandler');
const createRoomHandler = require('./socketHandlers/createRoomHandler');

const registerSocketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      method: ['GET', 'POST'],
    },
  });

  serverStore.setSocketServerInstance(io);

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit('online-users', { onlineUsers });
  };

  io.on('connection', (socket) => {
    console.log(`user connected with id : ${socket.id}`);
    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on('direct-message', (data) => {
      directMessageHandler(socket, data);
    });

    socket.on('direct-chat-history', (data) => {
      directChatHistoryHandler(socket, data);
    });

    socket.on('room-create', () => {
      createRoomHandler(socket);
    });

    socket.on('disconnect', () => {
      console.log(`user id ${socket.id} has been disconnected`);
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, [1000 * 8]);
};

module.exports = { registerSocketServer };
