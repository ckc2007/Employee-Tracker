const express = require("express");

const mysql = require("mysql2");

const inquirer = require("inquirer");

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
