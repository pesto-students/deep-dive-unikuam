/* eslint-disable linebreak-style */
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const dbConnectUrl = process.env.DB_CONNECT;

MongoClient.connect(dbConnectUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log('db is connected ');
    const db = client.db('todo-app');
    const Collection = db.collection('todo-list');
    // app.use()
    // app.get(/* ... */)
    // app.post(/* ... */)
    // app.listen(/* ... */)
  })
  .catch((error) => console.error(error));
