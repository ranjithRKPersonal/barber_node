const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const server = require('../config/serverConfigs');
const clientOption = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(
       `${server.server_status} | Mongoose default connection disconnected through app termination`
    );
    process.exit(0);
  });
});

const initTenantDbConnection = (DB_URL) => {
  try {
    console.log("DB_URL",DB_URL);
    const db = mongoose.createConnection(DB_URL, clientOption);

    db.on(
      'error',
      console.error.bind(
        console,
        `${server.server_status} | initTenantDbConnection MongoDB Connection Error>> : `
      )
    );
    db.once('open', () => {
      console.log(`${server.server_status} | initTenantDbConnection client MongoDB Connection ok!`);
    });

    // require all schemas !?
    require('../model/entry/schema');
    require('../model/otp/schema');
    require('../model/requestDemo/schema');
    require('../model/visitor/schema');
    require('../model/category/schema');
    require('../model/service/schema');
    require('../model/client/schema');
    require('../model/appointment/schema');
    require('../model/invoice/schema');
    require('../model/user/schema');
    require('../model/tax/schema');
    require('../model/campaign/schema');
    require('../model/featureMap/schema');
    require('../model/draft/schema');
    require('../model/expense/schema');
    return db;
  } catch (error) {
    console.log(`${server.server_status} | initTenantDbConnection error`, error);
  }
};

module.exports = {
  initTenantDbConnection,
};
