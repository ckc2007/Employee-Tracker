const mysql = require("mysql2");
const inquirer = require("inquirer");

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
                message:
                  "Please select the department for the role you added:",
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
        // get all roles from role
        db.query("SELECT * FROM role", (err, roleResults) => {
          if (err) throw err;
          // new arrary of role choices
          const roleArr = roleResults.map((role) => role.title);
          //   console.log(results);
          //   console.log(roleArr);
          // get all managers from employee
          //   keep in mind that if an employee is a manager themselves, then they will not have a manager, hence a null value
          db.query(
            "SELECT * FROM employee WHERE manager_id IS NULL",
            (err, managerResults) => {
              if (err) throw err;
              // create an array of manager names
              const managerArr = managerResults.map(
                (manager) => `${manager.first_name} ${manager.last_name}`
              );
              // prompt for input of new employee
              inquirer
                .prompt([
                  // first name
                  {
                    name: "firstName",
                    message: "What is the employee's first name?",
                    type: "input",
                  },
                  // last name
                  {
                    name: "lastName",
                    message: "What is the employee's last name?",
                    type: "input",
                  },
                  // role (see above)
                  {
                    name: "role",
                    message:
                      "Please select the employees role from the follwing list:",
                    type: "list",
                    choices: roleArr,
                  },
                  // manager (see above)
                  {
                    name: "manager",
                    message:
                      "Please select the employee's manager from the following list:",
                    type: "list",
                    choices: managerArr,
                  },
                ])
                .then((answer) => {
                  //   console.log(roleArr.indexOf(answer.role));
                  //   console.log(managerResults[roleArr.indexOf(answer.role)]);
                  const roleId =
                    roleResults[roleArr.indexOf(answer.role)].department_id;
                  const managerId =
                    managerResults[managerArr.indexOf(answer.manager)].id;

                  // add new employee to employee
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
