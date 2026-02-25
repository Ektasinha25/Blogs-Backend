const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'knowledge_platform'
});

module.exports = db.promise();