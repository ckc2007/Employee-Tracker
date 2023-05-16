-- Departments
INSERT INTO department (name) VALUES
('Engineering'),
('Science'),
('Operations'),
('Human Resources'),
('Information Technology');

-- Roles
INSERT INTO role (title, salary, department_id) VALUES
('Chief Exec', 200000, 1),
('Chief Tech', 180000, 1),
('Senior Engineer', 120000, 1),
('Junior Engineer', 80000, 1);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Mark', 'Johnson', 3, 2),
('Samantha', 'Lee', 3, 2);
