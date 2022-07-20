const authSocket = require('./middleware/authSocket');
const disconnectHandler = require('./socketHandlers/disconnectHandler');
const newConnectionHandler = require('./socketHandlers/newConnectionHandler');
const serverStore = require('./serverStore');

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

  io.on('connection', (socket) => {
    console.log(`user connected id => ${socket.id}`);
    newConnectionHandler(socket, io);

    socket.on('disconnect', () => {
      console.log(`user disconnected id => ${socket.id}`);
      disconnectHandler(socket);
    });
  });
};

module.exports = { registerSocketServer };
