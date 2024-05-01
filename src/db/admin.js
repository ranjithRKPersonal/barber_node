const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const server = require('../config/serverConfigs');

const clientOption = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 10,
  autoIndex: true,
  connectTimeoutMS: 20000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", () => {
  console.log("Mongoose default connection open");
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      `${server.server_status} | Mongoose default connection disconnected through app termination`
    );
    process.exit(0);
  });
});

const initAdminDbConnection = (DB_URL) => {
  try {
    const db = mongoose.createConnection(DB_URL, clientOption);
    db.on(
      "error",
      console.error.bind(
        console,
        `${server.server_status} | initAdminDbConnection MongoDB Connection Error>> : `
      )
    );
    db.once("open", () => {
      console.log(`${server.server_status} | initAdminDbConnection client MongoDB Connection ok!`);
    });

    // require all schemas !?
    require("../model/tenant/schema");
    
    return db;
  } catch (error) {
    console.log(`${server.server_status} | initAdminDbConnection error`, error);
  }
};

module.exports = {
  initAdminDbConnection,
};
