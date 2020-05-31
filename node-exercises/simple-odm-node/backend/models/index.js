const { MongoClient } = require('mongodb');
const config = require('./config.json');
const createConnection = (app) => {
  MongoClient.connect(config.dbConnectUrl, { useNewUrlParser: true,
  useUnifiedTopology: true }, (err, db) => {
    if (err) {
      console.log(`Failed to connect to the database. ${err.stack}`);
    }
    app.locals.db = db.db(config.dbName);
    const port = process.env.PORT || config.port;
    app.listen(port, () => {
      console.log(`Node.js app is listening at http://localhost:${port}`);
    });
  });
}

module.exports = createConnection;
