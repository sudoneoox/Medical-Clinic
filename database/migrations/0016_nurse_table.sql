CREATE TABLE IF NOT EXISTS nurses (
    nurse_id INTEGER NOT NULL AUTO_INCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    nurse_name VARCHAR(50) NOT NULL,
    nurse_employee_id INTEGER NOT NULL,
    specialization VARCHAR(50),
    years_of_experience TINYINT,
    PRIMARY KEY (nurse_id, nurse_employee_id)
);