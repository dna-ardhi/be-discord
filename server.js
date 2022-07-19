const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const socketServer = require('./socketServer');

const authRoutes = require('./routes/authRoutes');

const port = process.env.PORT || process.env.API_PORT;
const app = express();

app.use(express.json());
app.use(cors());

// Register the routes
app.use('/api/auth/', authRoutes);

const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`server is listening port ${port}`);
    });
  })
  .catch((error) => {
    console.log('database connection failed. Server not started');
    console.error(error);
  });
