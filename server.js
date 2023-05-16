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
        break;
      case "View all roles":
        // view all roles option
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

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
