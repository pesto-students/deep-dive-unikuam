const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const router = require('./router');
const mongoose = require('mongoose');
const websocketServer = require('websocket').server;
const cuid = require('cuid');
const clients = {};
const gameConnection = {};
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
  const currentPlayer = cuid();
  connection.on("open", () => {
    console.log('ws open');
  })
  connection.on("close", () => {
    delete clients[currentPlayer];
    console.log('ws close');
  })
  connection.on("message", message => {
    const result = JSON.parse(message.utf8Data);
    //handle create
    if (result.method === 'create') {
      const currentPlayer = result.currentPlayer;
      let availableClients = [];
      availableClients = Object.keys(clients).filter(currentClient => currentClient !== currentPlayer);
      const conn = clients[currentPlayer].connection;
      if (availableClients.length) {
        conn.send(JSON.stringify({ method: 'create', available: true, availableClients }));
      } else {
        conn.send(JSON.stringify({ method: 'create', available: false }));
      }
    }

    if (result.method === 'sendRequest') {
      const from = result.from;
      const to = result.to;
      const conn = clients[to].connection;
      conn.send(JSON.stringify({ method: 'sendRequest', reqSentBy: from }));
    }

    if (result.method === 'requestResult') {
      const from = result.from; //client anshul
      //result.currentPlayer is player of anshul
      const player1 = from || '';
      const player2 = result.currentPlayer;
      const conn = clients[from].connection;
      const gameId = cuid();
      gameConnection[gameId] = {
        [player1]: {
          defaultSnakeCoordinate: [],
          score: 0,
          currentDirection: '',
          foodCoordinate: {},
          isGameOver: false
        }
      }
      gameConnection[gameId] = {
        [player2]: {
          defaultSnakeCoordinate: [],
          score: 0,
          currentDirection: '',
          foodCoordinate: {},
          isGameOver: false
        }
      }
      conn.send(JSON.stringify({ method: 'requestResult', accepted: result.accepted, buddy: result.currentPlayer, gameId }));
    }

    if (result.method === 'setStateForCurrentUser') {
      const { currentState, gameId, currentPlayer, buddy, foodCoordinate } = result;
      gameConnection[gameId] = {
        [currentPlayer] : {
          defaultSnakeCoordinate: currentState.defaultSnakeCoordinate,
          score: currentState.score,
          currentDirection: currentState.currentDirection,
          left: currentState.left,
          top: currentState.top,
          isGameOver: currentState.isGameOver
        }
      }
      const conn = clients[buddy].connection;
      conn.send(JSON.stringify({ method: 'setBuddyState',
        state: gameConnection[gameId][currentPlayer],
        buddy: currentPlayer,
        foodCoordinate
      }));
    }

    if (result.method === 'setGameOverForCurrentUser') {
      const { gameId, currentPlayer, buddy } = result;
      gameConnection[gameId][currentPlayer].isGameOver = true;
      // const conn = clients[buddy].connection;
      // conn.send(JSON.stringify({ method: 'setGameOver' }));
    }
  })
  clients[currentPlayer] = {
    connection
  }
  const payload = {
    method: 'connect',
    currentPlayer
  }
  connection.send(JSON.stringify(payload));
})
// app.use(router);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
