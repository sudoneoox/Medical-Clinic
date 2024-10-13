CREATE TABLE IF NOT EXISTS valid_employees (
  employee_no INT NOT NULL UNIQUE PRIMARY KEY,
  employee_role ENUM('DOCTOR', 'RECEPTIONIST', 'NURSE', 'ADMIN')
);
