const oracledb = require('oracledb');
const dbConfig = require('../config/database');
var connection;

oracledb.autoCommit = true;
if (process.platform === 'darwin') {
    try {
      oracledb.initOracleClient({libDir: process.env.HOME + '/Desktop/instantclient_19_3'});
    } catch (err) {
      console.error('Whoops!');
      console.error(err);
      process.exit(1);
    }
}

async function initialize() {
    // const pool = await oracledb.createPool(dbConfig.hrPool);
    connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log(connection);
}

module.exports.initialize = initialize;
module.exports.connection = connection;