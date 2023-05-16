-- Departments
INSERT INTO department (id, name) VALUES
(1, 'Engineering'),
(2, 'Science'),
(3, 'Operations'),
(4, 'Human Resources'),
(5, 'Information Technology');

-- Roles
INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Chief Exec', 200000, 1),
(2, 'Chief Tech', 180000, 1),
(3, 'Senior Engineer', 120000, 1),
(4, 'Junior Engineer', 80000, 1);

-- Employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Mark', 'Johnson', 3, 2),
(4, 'Samantha', 'Lee', 3, 2);
