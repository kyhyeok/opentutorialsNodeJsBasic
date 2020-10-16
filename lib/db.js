const mysql = require("mysql");
const dbInfo = require("../db/config");

const db = mysql.createConnection({
  host: dbInfo.host,
  user: dbInfo.user,
  password: dbInfo.password,
  database: dbInfo.database
});
db.connect();

module.exports = db;
