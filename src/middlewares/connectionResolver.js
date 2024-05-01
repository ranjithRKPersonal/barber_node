const { createNamespace } = require("continuation-local-storage");
const server = require('../config/serverConfigs')

const {
  getConnectionByTenant,
  getAdminConnection,
} = require("../connectionManager");

// Create a namespace for the application.
let nameSpace = createNamespace("unique context");

/**
 * Get the connection instance for the given tenant's name and set it to the current context.
 */
const resolveTenant = (req, res, next) => {
  const tenant = req.headers.tenant;
  if (!tenant) {
    return res
      .status(500)
      .json({ error: `Please provide tenant's name to connect` });
  }
  // Run the application in the defined namespace. It will contextualize every underlying function calls.
  nameSpace.run(() => {
    const tenantDbConnection = getConnectionByTenant(tenant);
    console.log(`${server.server_status} | resolveTenant tenantDbConnection`);
    nameSpace.set("connection", tenantDbConnection);
    next();
  });
};

/**
 * Get the admin db connection instance and set it to the current context.
 */
const setAdminDb = (req, res, next) => {
  // Run the application in the defined namespace. It will contextualize every underlying function calls.
  nameSpace.run(() => {
    const adminDbConnection = getAdminConnection();
    console.log(`${server.server_status} | setAdminDb adminDbConnection`, adminDbConnection.name);
    nameSpace.set("connection", adminDbConnection);
    next();
  });
};

module.exports = { resolveTenant, setAdminDb };
