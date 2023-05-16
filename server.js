const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL Username
    user: "root",
    // TODO: Add MySQL Password
    password: "",
    database: "hr_db",
  },
  console.log(`Connected to the hr_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server.");
});

inquirer
  .createPromptModule([
    {
      type: "list",
      name: "option",
      message: "what would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    },
  ])
  .then((response) => {
    switch (response.option) {
      case "View all departments":
        // view all departments option
        db.query("SELECT * FROM department", (err, results) => {
          if (err) throw err;
          console.table(results);
        });
        break;
      case "View all roles":
        // view all roles option
        db.query(
          "SELECT title, role.id, department.name AS department FROM role LEFT JOIN department ON role.department.id",
          (err, results) => {
            if (err) throw err;
            console.table(results);
          }
        );
        break;
      case "View all employees":
        //view all employees option
        break;
      case "Add a department":
        // add a department option
        break;
      case "Add a role":
        // add a role option
        break;
      case "Add an employee":
        // add an employee option
        break;
      case "Update an employee role":
        // update an employee role option
        break;
      case "Exit":
        // exit option
        break;
      default:
        console.log(`Invalid option: ${answer.option}`);
        break;
    }
  });

// Query database using SUM(), MAX(), MIN() AVG() and GROUP BY
// db.query('SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
//     console.log(results);
//   });

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
