const mysql2 = require("mysql2");
require('dotenv').config();

const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10
});
console.log(process.env.JWT_SECRET);

module.exports = dbConnection.promise()
