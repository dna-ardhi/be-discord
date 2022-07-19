const registerSocketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      method: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`user connected id => ${socket.id}`);
  });
};

module.exports = { registerSocketServer };
