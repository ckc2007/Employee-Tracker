const mysql = require("mysql2");

const inquirer = require("inquirer");

inquirer.createPromptModule([
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
]);
