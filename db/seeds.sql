-- Departments
INSERT INTO department (name) VALUES
('Engineering'),
('Science'),
('Operations'),
('Medical'),
('Security'),
('Command'),
('Tactical'),
('Navigation'),
('Diplomacy');

-- Roles
INSERT INTO role (title, salary, department_id) VALUES
('Captain', 80000, 6),
('First Officer', 70000, 6),
('Chief Engineer', 65000, 1),
('Science Officer', 65000, 2),
('Security Chief', 65000, 5),
('Helmsman', 30000, 8),
('Tactical Officer', 35000, 7),
('Communications Officer', 25000, 8),
('Diplomatic Officer', 120000, 9);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Jack', 'Sparrow', 1, NULL),
('Mr.', 'Spock', 2, NULL),
('William', 'Riker', 3, 2),
('Jadzia', 'Dax', 4, 2);
