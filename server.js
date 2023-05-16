const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL Username
      user: 'root',
      // TODO: Add MySQL Password
      password: '',
      database: 'books_db'
    },
    console.log(`Connected to the books_db database.`)
  );

  