//Original code written by me
// Importing the mysql2 package which is required for interacting with MySQL databases
const mysql = require('mysql2');

// Creating a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost', // The host of the MySQL server
  user: 'root', // The username to authenticate with the MySQL server
  password: '', // The password for the MySQL user
  database: 'mental_health' // The name of the specific database to connect to
});

// Establishing the connection to the MySQL server & handling potential errors
db.connect((err) => {
  if (err) throw err;  // If there's an error in the connection, throw the error & stop execution
  console.log('Connected to MySQL Database');  // If successful, log a success message to the console
});

// Exporting the db connection object so it can be used in other parts of the application
module.exports = db;