const express = require("express");
const cluster = require("cluster");
const server = require('../config/serverConfigs')
// Mounting routes on api
const v1Routes = require("../routes/v1/routes");
const v2Routes = require("../routes/v2/routes");
//Routes initialize
const apiRoutes = express.Router();

//App initialize
const router = (app) => {
  apiRoutes.use("/v1", v1Routes);
  apiRoutes.use("/v2", v2Routes);
  // Home API Route
  app.get("/", (req, res, next) => {
    res.send({
      'Status': `${server.server_status} OK`,
      body:`${process.pid}`
    })
  });

  // If no routes matches
  apiRoutes.use((req, res, next) => {
    if (!req.route) {
      const error = new Error("No route matched");
      error.status = 404;
      return next(error);
    }
    next();
  });
  app.use("/api", apiRoutes);
  app.use("/uploads", express.static("uploads"));
};

module.exports = router;
