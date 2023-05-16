-- Departments
INSERT INTO department (name) VALUES
('Engineering'),
('Science'),
('Operations'),
('Medical'),
('Security')
('Command'),
('Tactical'),
('Navigation'),
('Diplomacy');

-- Roles
INSERT INTO role (title, salary, department_id) VALUES
('Captain', 80000, 1),
('First Officer', 70000, 1),
('Chief Engineer', 65000, 1),
('Science Officer', 65000, 1),
('Security Chief', 65000, 1),
('Helmsman', 30000, 1),
('Tactical Officer', 35000, 1),
('Communications Officer', 25000, 1),
('Diplomatic Officer', 120000, 1);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Jack', 'Sparrow', 1, NULL),
('Mr.', 'Spock', 2, 1),
('William', 'Riker', 3, 2),
('Jadzia', 'Dax', 3, 2);
