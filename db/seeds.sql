-- Departments
INSERT INTO department (id, name) VALUES
(1, 'Engineering'),
(2, 'Science'),
(3, 'Operations'),
(4, 'Human Resources'),
(5, 'Information Technology');

-- Roles
INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Chief Executive Officer', 200000, 1),
(2, 'Chief Technology Officer', 180000, 1),
(3, 'Senior Engineer', 120000, 1),
(4, 'Junior Engineer', 80000, 1),
(5, 'Chief Scientist', 180000, 2),
(6, 'Senior Scientist', 120000, 2),
(7, 'Junior Scientist', 80000, 2),
(8, 'Chief Operations Officer', 180000, 3),
(9, 'Senior Operations Manager', 120000, 3),
(10, 'Junior Operations Analyst', 80000, 3),
(11, 'Chief Human Resources Officer', 180000, 4),
(12, 'Senior Human Resources Manager', 120000, 4),
(13, 'Junior Human Resources Specialist', 80000, 4),
(14, 'Chief Information Officer', 180000, 5),
(15, 'Senior IT Manager', 120000, 5),
(16, 'Junior IT Support', 80000, 5);

-- Employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Mark', 'Johnson', 3, 2),
(4, 'Samantha', 'Lee', 3, 2),
(5, 'David', 'Brown', 4, 2),
(6, 'Elizabeth', 'Davis', 5, 1),
(7, 'William', 'Wilson', 6, 6),
(8, 'Michelle', 'Anderson', 6, 6),
(9, 'Joseph', 'Thomas', 7, 6),
(10, 'Stephanie', 'Jackson', 8, 1),
(11, 'Nathan', 'Garcia', 9, 10),
(12, 'Amanda', 'Parker', 9, 10),
(13, 'Jason', 'Evans', 10, 10),
(14, 'Emily', 'Collins', 11, 1),
(15, 'Brandon', 'White', 12, 14),
(16, 'Jennifer', 'Harris', 13, 14),
(17, 'Alexander', 'Martin', 14, 1),
(18, 'Michael', 'Thompson', 15, 17),
(19, 'Lauren', 'Allen', 16, 17);
