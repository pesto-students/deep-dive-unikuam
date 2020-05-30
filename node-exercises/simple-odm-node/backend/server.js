/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const dbConnectUrl = process.env.DB_CONNECT;
const app = express();
app.use(bodyParser.json());
let userEmail;

MongoClient.connect(dbConnectUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    const appDb = client.db('todo-app');
    const todoList = appDb.collection('todo-list');
    app.post('/login', (req, res) => {
      const { email } = req.body;
      todoList.findOne({ email }, (err, result) => {
        if (!result) {
          res.status(404).send('Sorry user not available');
          return;
        }
        // eslint-disable-next-line dot-notation
        userEmail = result['email'];
        res.status(200).json(result);
      });
    });
    app.post('/add', (req, res) => {
      todoList.findOneAndUpdate({ email: userEmail },
        { $push: { tasks: req.body } },
        { updatedExisting: true }, (err, result) => {
          res.status(200).json(result);
        });
    });
  })
  .catch((error) => console.error(error));

//   Decide the structure of JSON.

app.listen(3000, () => console.log('listening on 3000'));
// frontend
