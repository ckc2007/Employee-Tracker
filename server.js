// TO DO:
// getting error on adding info - find a way to create uniqu ids - use uuid
// debug new employee, update employee, new info etc
// do sample video

const mysql = require("mysql2");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;

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
  runPrompt();
});

const prompt = inquirer.createPromptModule();

function runPrompt() {
  prompt([
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
  ]).then((response) => {
    switch (response.option) {
      case "View all departments":
        // view all departments option
        db.query("SELECT * FROM department", (err, results) => {
          if (err) throw err;
          console.clear();
          console.table(results);
          runPrompt();
        });
        break;
      case "View all roles":
        // view all roles option
        db.query(
          "SELECT title, role.id, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id",
          (err, results) => {
            if (err) throw err;
            console.clear();
            console.table(results);
            runPrompt();
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
            console.clear();
            console.table(results);
            runPrompt();
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
              "Please enter the name of the department you would like to add:",
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
                console.clear();
                console.log("Role added successfully!");
                runPrompt();
              }
            );
          });
        break;
      case "Add an employee":
        // add an employee option
        // get all roles from role
        db.query("SELECT * FROM role", (err, results) => {
          if (err) throw err;
          // new arrary of role choices
          const roleArr = results.map((role) => role.title);
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
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName",
                  },
                  // last name
                  {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName",
                  },
                  // role (see above)
                  {
                    type: "list",
                    message:
                      "Please select the employees role from the follwing list:",
                    choices: roleArr,
                    name: "role",
                  },
                  // manager (see above)
                  {
                    type: "list",
                    message:
                      "Please select the employee's manager from the following list:",
                    choices: managerArr,
                    name: "manager",
                  },
                ])
                .then((answer) => {
                //   console.log(roleArr.indexOf(answer.role));
                //   console.log(managerResults[roleArr.indexOf(answer.role)]);
                  const roleId =
                    results[roleArr.indexOf(answer.role)].department_id;
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
        db.query("SELECT * FROM role", (err, results) => {
          if (err) throw err;
          // Create an array of role choices with role name and ID
          const roleChoices = results.map((role) => ({
            name: `${role.title} (ID: ${role.id})`,
            value: role.id,
          }));

          // List all employees in an array
          db.query("SELECT * FROM employee", (err, results) => {
            if (err) throw err;
            // New array of employee choices
            const employeeArr = results.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            );

            // Select the employee to update and enter the new role ID
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Please select an employee to update:",
                  choices: employeeArr,
                  name: "employee",
                },
                {
                  type: "list",
                  message: "Please select the employee's new role:",
                  choices: roleChoices,
                  name: "role_id",
                },
              ])
              .then((answer) => {
                // Get the employee's ID based on the selection
                const employeeId =
                  results[employeeArr.indexOf(answer.employee)].id;

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
// runPrompt();
