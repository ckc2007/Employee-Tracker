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
        db.query(
          "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager " +
            "FROM employee " +
            "LEFT JOIN role ON employee.role_id = role.id " +
            "LEFT JOIN department ON role.department_id = department.id " +
            "LEFT JOIN employee manager ON employee.manager_id = manager.id",
          (err, results) => {
            if (err) throw err;
            console.table(results);
          }
        );
        break;
      case "Add a department":
        // add a department option
        inquirer
          .prompt({
            type: "input",
            name: "newDepartment",
            message:
              "Please enter the name of the department you woul dlike to add:",
          })
          .then((answer) => {
            db.query(
              "INSERT INTO department (name) VALUES (?)",
              answer.newDepartment,
              (err, result) => {
                if (err) throw err;
                console.log(
                  `${answer.newDepartment} added successfully to the department table.`
                );
              }
            );
          });
        break;
      case "Add a role":
        // add a role option
        inquirer
        .prompt([
          {
            type: "input",
            message: "Please enter the name of the role you want to add:",
            name: "name",
          },
          {
            type: "input",
            message: "Please enter the salary of the role you added:",
            name: "salary",
          },
          {
            type: "input",
            message: "Please enter the department id for the role you added:",
            name: "department_id",
          },
        ])
        .then((answers) => {
          db.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
            [answers.name, answers.salary, answers.department_id],
            (err, results) => {
              if (err) throw err;
              console.log("Role added successfully!");
            }
          );
        });
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
