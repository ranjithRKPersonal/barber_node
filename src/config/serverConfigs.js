const config = require('./env.json');
const { execSync } = require('child_process');
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const serverStatus = branchName !== 'master';
console.log('Active branch',branchName )
const server = {
  server_current_branch: branchName,
  server_status: serverStatus ? 'local' : 'production 🚀',
  mongodb_admin_uri: serverStatus
    ? `mongodb+srv://adminUser123:adminUser123@barber.bvlsypq.mongodb.net/adminUser123?retryWrites=true&w=majority&appName=barber`
    : `mongodb+srv://${config.PRODUCTION_MONGO_USERNAME}:${config.PRODUCTION_MONGO_PASSWORD}@fastbokz.in1grre.mongodb.net/${config.PRODUCTION_ADMIN}?retryWrites=true&w=majority`,
  mongodb_user_name: serverStatus
    ? config.DEV_MONGODB_USER_NAME
    : config.PRODUCTION_MONGO_USERNAME,
  mongodb_password: serverStatus
    ? config.DEV_MONGODB_PASSWORD
    : config.PRODUCTION_MONGO_PASSWORD,
  mongodb_admin_db: serverStatus
    ? config.DEV_ADMIN_DB
    : config.PRODUCTION_ADMIN,
  super_admin_email: config.PROD_DEV_SUPER_ADMIN_EMAIL, // local and production has same email,password only for superadmin
  super_admin_password: config.PROD_DEV_SUPER_ADMIN_PASSWORD,
};

module.exports = server;
