const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const router = require('./router');
const mongoose = require('mongoose');
const websocketServer = require('websocket').server;
const cuid = require('cuid');
const clients = {};
const gameConnections = {};
// mongoose.connect('mongodb://localhost/chatUsers', {
//     useNewUrlParser: true
// }).then(() => console.log('connected to MongoDB.....'))
//         .catch(err => console.error('Could not connect to mongoDB...', err));

const server = http.createServer((req, res) => {
  console.log('http connection');
})
const websocket = new websocketServer({
  httpServer: server
})

websocket.on('request', request => {
  connection = request.accept(null, request.origin);
  const clientId = cuid();
  connection.on("open", () => {
    console.log('ws open');
  })
  connection.on("close", () => {
    delete clients[clientId];
    console.log('ws close');
  })
  connection.on("message", message => {
    const result = JSON.parse(message.utf8Data);
    //handle create
    if (result.method === 'create') {
      console.log(clients);
      const clientId = result.clientId;
      let availableClients = [];
      //game connection id represent if any one started to play or not for two players there would be single game id
      // const gameConnectionId = cuid();
      // gameConnections[gameConnectionId] = {
      //   gameConnectionId
      // }
      availableClients = Object.keys(clients).filter(currentClient => currentClient !== clientId);
      const conn = clients[clientId].connection;
      if (availableClients.length) {
        conn.send(JSON.stringify({ method: 'create', available: true, availableClients }));
      } else {
        conn.send(JSON.stringify({ method: 'create', available: false }));
      }
    }

    if (result.method === 'sendRequest') {
      console.log(result);
      const from = result.from;
      const to = result.to;
      const conn = clients[to].connection;
      conn.send(JSON.stringify({ method: 'sendRequest', reqSentBy: from }));
    }

    if (result.method === 'requestResult') {
      const from = result.from;
      const conn = clients[from].connection;
      conn.send(JSON.stringify({ method: 'requestResult', accepted: result.accepted, player: result.clientId }));
    }

    if (result.method === 'processGame') {
      const currentState = result.currentState;
      const conn = clients[currentState.player].connection;
      conn.send(JSON.stringify({ method: 'processGame', currentState: currentState }));
    }
  })
  clients[clientId] = {
    connection
  }
  const payload = {
    method: 'connect',
    clientId
  }
  console.log(clients);
  connection.send(JSON.stringify(payload));
})
// app.use(router);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
