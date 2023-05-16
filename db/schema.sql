CREATE DATABASE hr_db;

USE hr_db;

CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE role (
  id INT PRIMARY KEY,
  title VARCHAR(50),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);