const { getNamespace } = require('continuation-local-storage');

const server = require('../src/config/serverConfigs');
const config = require('./config/env.json');
const { initAdminDbConnection } = require('./db/admin');

const { initTenantDbConnection } = require('./db/tenant');

const tenantService = require('./service/tenant');
const logger = require('../src/logger/index');
let connectionMap;
let adminDbConnection;

/**
 * Create knex instance for all the tenants defined in common database and store in a map.
 **/
const connectAllDb = async () => {
  let tenants;
  //PRODUCTION DB  🚀  🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀
  adminDbConnection = initAdminDbConnection(server.mongodb_admin_uri);
  console.log(`${server.server_status} | connectAllDb adminDbConnection`);

  try {
    tenants = await tenantService.getAllTenants(adminDbConnection);
    console.log(`${server.server_status} | connectAllDb tenants`);
  } catch (e) {
    console.log(`${server.server_status} | connectAllDb error`, e);
    return;
  }

  connectionMap = tenants
    .map((tenant, index) => {
      console.log(
        `${server.server_status} | TenantDB(${index + 1})`,
        tenant.dbName
      );
      let TENANT_DB = '';
      if (server.server_status === 'local') {
        TENANT_DB = `mongodb+srv://${server.mongodb_user_name}:${server.mongodb_password}@barber.bvlsypq.mongodb.net/${tenant.dbName}?retryWrites=true&w=majority`;
      } else {
        TENANT_DB = `mongodb+srv://${server.mongodb_user_name}:${server.mongodb_password}@fastbokz.in1grre.mongodb.net/${tenant.dbName}?retryWrites=true&w=majority`;
      }
      return {
        //  PRODUCTION DB  🚀  🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀

        [tenant.dbName]: initTenantDbConnection(TENANT_DB),
      };
    })
    .reduce((prev, next) => {
      return Object.assign({}, prev, next);
    }, {});
  console.log(`${server.server_status} | connectAllDb connectionMap`);
};

/**
 * Get the connection information (knex instance) for the given tenant's slug.
 */
const getConnectionByTenant = (tenant) => {
  console.log(`${server.server_status} | Getting connection for ${tenant}`);
  if (connectionMap) {
    return connectionMap[tenant];
  }
};

/**
 * Get the admin db connection.
 */
const getAdminConnection = () => {
  if (adminDbConnection) {
    console.log(`${server.server_status} | Getting adminDbConnection`);
    return adminDbConnection;
  }
};

/**
 * Get the connection information (knex instance) for current context. Here we have used a
 * getNamespace from 'continuation-local-storage'. This will let us get / set any
 * information and binds the information to current request context.
 */
const getConnection = () => {
  const nameSpace = getNamespace('unique context');
  const conn = nameSpace.get('connection');
  console.log(`${server.server_status} | Test Conn `);
  if (!conn) {
    logger.error(' [ Failed Connection is not set for any tenant database ]');
    throw new Error(
      `${server.server_status} | Connection is not set for any tenant database`
    );
  }
  return conn;
};

module.exports = {
  connectAllDb,
  getAdminConnection,
  getConnection,
  getConnectionByTenant,
};
