const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "school_management",
});

// Export the pool for use in other files
module.exports = pool.promise();
