const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");
const env = require("dotenv").config();
const server = require("../src/config/serverConfigs");
const config = require("../src/config/env.json");
const { connectAllDb } = require("./connectionManager");
const cpus = require("os").cpus();
const cluster = require("cluster");
const fs = require("fs");
// mount the api routes
const router = require("./routes/routes");

// Express app instance
const app = express();
const PORT = process.env.PORT || 9004;
app.set("port", PORT);

// helmet for security purpose
app.use(helmet());

// Logging Http Request
const log4js = require("log4js");
const appLogger = log4js.getLogger();
app.use(log4js.connectLogger(appLogger));

// CORS - To handle cross origin requests
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 500000000,
  })
);

connectAllDb();

global.appRoot = path.resolve(__dirname);

router(app);

if (cluster.isMaster) {
  console.log(`${server.server_status} | Master ${process.pid}`);
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, sgl) => {
    console.log(
      `${server.server_status} | Worker killed ${worker.process.pid}`
    );
    cluster.fork();
  });
} else {
  // local Server
  app.listen(PORT, () => {
    console.log(`${server.server_status} | Workers ${process.pid}`);
    console.log(
      `${server.server_status} | Express server started at port: ${PORT}`
    );
  });
}