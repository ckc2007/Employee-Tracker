const mysql = require("mysql2");
const inquirer = require("inquirer");
const chalk = require("chalk");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "hr_db",
  },
  console.log(`Connected to the hr_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server.");
  runPrompt();
});

const prompt = inquirer.createPromptModule();

function runPrompt() {
  prompt([
    {
      name: "option",
      message: "what would you like to do?",
      type: "list",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Update employee manager",
        "View employees by manager",
        "Delete department",
        "Delete role",
        "Delete employee",
        "View department budget",
        "Exit",
      ],
    },
  ]).then((response) => {
    switch (response.option) {
      // view all departments option
      case "View all departments":
        db.query(
          "SELECT id, name AS department FROM department",
          (err, results) => {
            if (err) throw err;
            console.clear();
            console.table(results);
            runPrompt();
          }
        );
        break;
      // view all roles option
      case "View all roles":
        db.query(
          "SELECT title, role.id, department.name AS department,role.salary FROM role LEFT JOIN department ON role.department_id = department.id",
          (err, results) => {
            if (err) throw err;
            console.clear();
            console.table(results);
            runPrompt();
          }
        );
        break;
      //view all employees option
      case "View all employees":
        db.query(
          "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager " +
            "FROM employee " +
            "LEFT JOIN role ON employee.role_id = role.id " +
            "LEFT JOIN department ON role.department_id = department.id " +
            "LEFT JOIN employee manager ON employee.manager_id = manager.id",
          (err, results) => {
            if (err) throw err;
            console.clear();
            console.table(results);
            runPrompt();
          }
        );
        break;
      // add a department option
      case "Add a department":
        inquirer
          .prompt({
            name: "newDepartment",
            message:
              "Please enter the name of the department you would like to add:",
            type: "input",
          })
          .then((answer) => {
            db.query(
              "INSERT INTO department SET ?",
              { name: answer.newDepartment },
              (err, result) => {
                if (err) throw err;
                console.clear();
                console.log(
                  `${answer.newDepartment} added successfully to the department table.`
                );
                runPrompt();
              }
            );
          });
        break;
      // add a role option
      case "Add a role":
        db.query("SELECT * FROM department", (err, results) => {
          if (err) throw err;
          const departments = results.map((department) => ({
            name: department.name,
            value: department.id,
          }));

          inquirer
            .prompt([
              {
                name: "name",
                message: "Please enter the name of the role you want to add:",
                type: "input",
              },
              {
                name: "salary",
                message: "Please enter the salary of the role you added:",
                type: "input",
              },
              {
                name: "department_id",
                message: "Please select the department for the role you added:",
                type: "list",
                choices: departments,
              },
            ])
            .then((answers) => {
              db.query(
                "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                [answers.name, answers.salary, answers.department_id],
                (err, results) => {
                  if (err) throw err;
                  console.clear();
                  console.log("Role added successfully!");
                  runPrompt();
                }
              );
            });
        });
        break;
      // add an employee option
      case "Add an employee":
        // Get all roles from the role table
        db.query("SELECT * FROM role", (err, roleResults) => {
          if (err) throw err;
          // New array of role choices
          const roleArr = roleResults.map((role) => role.title);
          // Get all managers from the employee table
          // Keep in mind that if an employee is a manager themselves, then they will not have a manager (null value)
          db.query(
            "SELECT * FROM employee WHERE manager_id IS NULL",
            (err, managerResults) => {
              if (err) throw err;
              // Create an array of manager names
              const managerArr = managerResults.map(
                (manager) => `${manager.first_name} ${manager.last_name}`
              );
              // Prompt for input of new employee
              const questions = [
                // First name
                {
                  name: "firstName",
                  message: "What is the employee's first name?",
                  type: "input",
                },
                // Last name
                {
                  name: "lastName",
                  message: "What is the employee's last name?",
                  type: "input",
                },
                // Role (see above)
                {
                  name: "role",
                  message:
                    "Please select the employee's role from the following list:",
                  type: "list",
                  choices: roleArr,
                },
                // Manager (see above)
                {
                  name: "manager",
                  message:
                    "Please select the employee's manager from the following list:",
                  type: "list",
                  choices: managerArr,
                },
                // Go back to menu option
                {
                  name: "action",
                  message: "What would you like to do?",
                  type: "list",
                  choices: ["Add the employee", "Go back to menu"],
                },
              ];

              inquirer.prompt(questions).then((answer) => {
                if (answer.action === "Go back to menu") {
                  // Go back to the menu
                  runPrompt();
                } else {
                  // Continue with adding an employee
                  const roleId = roleResults[roleArr.indexOf(answer.role)].id;
                  const managerId =
                    managerResults[managerArr.indexOf(answer.manager)].id;

                  // Add new employee to the employee table
                  db.query(
                    "INSERT INTO employee SET ?",
                    {
                      first_name: answer.firstName,
                      last_name: answer.lastName,
                      role_id: roleId,
                      manager_id: managerId,
                    },
                    (err) => {
                      if (err) throw err;
                      console.clear();
                      console.log("Employee added to the database!");
                      runPrompt();
                    }
                  );
                }
              });
            }
          );
        });
        break;

      case "Update an employee role":
        // Retrieve roles from the role table
        db.query("SELECT * FROM role", (err, roleResults) => {
          if (err) throw err;
          // Create an array of role choices with role name and ID
          const roleChoices = roleResults.map((role) => ({
            name: `${role.title} (ID: ${role.id})`,
            value: role.id,
          }));

          // List all employees in an array
          db.query("SELECT * FROM employee", (err, employeeResults) => {
            if (err) throw err;
            // New array of employee choices
            const employeeArr = employeeResults.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            );

            // Select the employee to update and enter the new role ID
            inquirer
              .prompt([
                {
                  name: "employee",
                  message: "Please select an employee to update:",
                  type: "list",
                  choices: employeeArr,
                },
                {
                  name: "role_id",
                  message: "Please select the employee's new role:",
                  type: "list",
                  choices: roleChoices,
                },
              ])
              .then((answer) => {
                // Get the employee's ID based on the selection
                const employeeId =
                  employeeResults[employeeArr.indexOf(answer.employee)].id;

                // Update the employee role in the employee table
                db.query(
                  "UPDATE employee SET role_id = ? WHERE id = ?",
                  [answer.role_id, employeeId],
                  (err) => {
                    if (err) throw err;
                    console.clear();
                    console.log("Employee role updated successfully!");
                    runPrompt();
                  }
                );
              });
          });
        });
        break;

      case "Update employee manager":
        // Retrieve employees who are not managers and have a non-null manager_id
        const employeeQuery =
          "SELECT * FROM employee WHERE id NOT IN (SELECT manager_id FROM employee WHERE manager_id IS NOT NULL) AND manager_id IS NOT NULL";
        db.query(employeeQuery, (err, employees) => {
          if (err) throw err;

          // New array of employee choices
          const employeeChoices = employees.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          );

          // Retrieve employees who are managers
          const managerQuery =
            "SELECT * FROM employee WHERE manager_id IS NULL";
          db.query(managerQuery, (err, managers) => {
            if (err) throw err;

            // New array of manager choices
            const managerChoices = managers.map(
              (manager) => `${manager.first_name} ${manager.last_name}`
            );

            // Prompt to select an employee to update and a new manager
            inquirer
              .prompt([
                {
                  name: "employee",
                  message: "Please select an employee to update:",
                  type: "list",
                  choices: employeeChoices,
                },
                {
                  name: "manager",
                  message: "Please select a new manager for the employee:",
                  type: "list",
                  choices: managerChoices,
                },
              ])
              .then((answers) => {
                const selectedEmployee = employees.find(
                  (employee) =>
                    `${employee.first_name} ${employee.last_name}` ===
                    answers.employee
                );

                const selectedManager = managers.find(
                  (manager) =>
                    `${manager.first_name} ${manager.last_name}` ===
                    answers.manager
                );

                // Update the manager_id in the employee table
                const updateQuery =
                  "UPDATE employee SET manager_id = ? WHERE id = ?";
                db.query(
                  updateQuery,
                  [selectedManager.id, selectedEmployee.id],
                  (err) => {
                    if (err) throw err;
                    console.clear();
                    console.log("Employee's manager updated successfully!");
                    runPrompt();
                  }
                );
              });
          });
        });
        break;

      case "View employees by manager":
        // Retrieve employees without a manager (manager_id is null)
        db.query(
          "SELECT * FROM employee WHERE manager_id IS NULL",
          (err, managerResults) => {
            if (err) throw err;
            // New array of manager choices
            const managerArr = managerResults.map(
              (manager) => `${manager.first_name} ${manager.last_name}`
            );

            // Prompt to select a manager
            inquirer
              .prompt([
                {
                  name: "manager",
                  message: "Please select a manager:",
                  type: "list",
                  choices: managerArr,
                },
              ])
              .then((answer) => {
                // Get the selected manager's ID
                const managerId =
                  managerResults[managerArr.indexOf(answer.manager)].id;

                // Retrieve employees who have the selected manager
                db.query(
                  "SELECT * FROM employee WHERE manager_id = ?",
                  [managerId],
                  (err, employeeResults) => {
                    if (err) throw err;
                    // Display employees in a table
                    console.table(employeeResults);
                    runPrompt();
                  }
                );
              });
          }
        );
        break;

      case "Delete department":
        // retrieve all departments from the database
        db.query("SELECT * FROM department", (err, deptResults) => {
          if (err) throw err;
          // Create an array of department choices
          const deptArr = deptResults.map((dept) => dept.name);

          inquirer
            .prompt([
              {
                name: "department",
                message: "Please select a department to delete:",
                type: "list",
                choices: deptArr,
              },
            ])
            .then((answer) => {
              const selectedDepartment = deptResults.find(
                (department) => department.name === answer.department
              );

              // Update the associated roles' department_id to NULL
              db.query(
                "UPDATE role SET department_id = NULL WHERE department_id = ?",
                [selectedDepartment.id],
                (err) => {
                  if (err) throw err;

                  // Delete the selected department from the department table
                  db.query(
                    "DELETE FROM department WHERE id = ?",
                    [selectedDepartment.id],
                    (err) => {
                      if (err) throw err;
                      console.log("Department deleted successfully!");
                      runPrompt();
                    }
                  );
                }
              );
            });
        });
        break;

      case "Delete role":
        // Retrieve all roles from the database
        db.query("SELECT * FROM role", (err, roleResults) => {
          if (err) throw err;
          // Create an array of role choices
          const roleArr = roleResults.map((role) => role.title);

          inquirer
            .prompt([
              {
                name: "role",
                message: "Please select a role to delete:",
                type: "list",
                choices: roleArr,
              },
            ])
            .then((answer) => {
              const selectedRole = roleResults.find(
                (role) => role.title === answer.role
              );

              // Update employees with the selected role to have null as their role_id
              db.query(
                "UPDATE employee SET role_id = NULL WHERE role_id = ?",
                [selectedRole.id],
                (err) => {
                  if (err) throw err;

                  // Delete the selected role from the role table
                  db.query(
                    "DELETE FROM role WHERE id = ?",
                    [selectedRole.id],
                    (err) => {
                      if (err) throw err;
                      console.log("Role deleted successfully!");
                      runPrompt();
                    }
                  );
                }
              );
            });
        });
        break;

      case "Delete employee":
        // Retrieve all employees from the database
        db.query("SELECT * FROM employee", (err, employeeResults) => {
          if (err) throw err;
          // Create an array of employee choices
          const employeeArr = employeeResults.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          );

          inquirer
            .prompt([
              {
                name: "employee",
                message: "Please select an employee to delete:",
                type: "list",
                choices: employeeArr,
              },
            ])
            .then((answer) => {
              const selectedEmployee = employeeResults.find(
                (employee) =>
                  `${employee.first_name} ${employee.last_name}` ===
                  answer.employee
              );

              // Delete the selected employee from the employee table
              db.query(
                "DELETE FROM employee WHERE id = ?",
                [selectedEmployee.id],
                (err) => {
                  if (err) throw err;
                  console.log("Employee deleted successfully!");
                  runPrompt();
                }
              );
            });
        });
        break;

      case "View department budget":
        // Retrieve departments
        db.query("SELECT * FROM department", (err, departmentResults) => {
          if (err) throw err;
          // New array of department choices
          const departmentArr = departmentResults.map(
            (department) => department.name
          );

          // Prompt to select a department
          inquirer
            .prompt([
              {
                name: "department",
                message: "Please select a department:",
                type: "list",
                choices: departmentArr,
              },
            ])
            .then((answer) => {
              // Get the selected department
              const selectedDepartment = departmentResults.find(
                (department) => department.name === answer.department
              );

              // Retrieve the total utilized budget of the department
              // note: try out using table aliases to shorten the code
              db.query(
                `SELECT SUM(r.salary) AS utilized_budget
                  FROM employee AS e
                  INNER JOIN role AS r ON e.role_id = r.id
                  WHERE r.department_id = ?`,
                [selectedDepartment.id],
                (err, budgetResult) => {
                  if (err) throw err;
                  const utilizedBudget = budgetResult[0].utilized_budget || 0;
                  console.log(
                    `Total Utilized Budget: ${chalk.green(
                      `$${utilizedBudget}`
                    )}`
                  );
                  runPrompt();
                }
              );
            });
        });
        break;

      case "Exit":
        // handle exit option
        process.exit();
        break;
      default:
        console.log(`Invalid option: ${answer.option}`);
        runPrompt();
        break;
    }
  });
}
