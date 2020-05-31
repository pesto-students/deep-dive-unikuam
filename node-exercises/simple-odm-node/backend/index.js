const express = require('express');
const bodyParser = require('body-parser');
const todo = require('./routes');
const makeConnection = require('./models');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use('/api/todo', todo);
makeConnection(app);
