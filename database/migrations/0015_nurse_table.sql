CREATE TABLE IF NOT EXISTS nurses (
    nurse_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    nurse_employee_id INTEGER NOT NULL,
    nurse_fname VARCHAR(50) NOT NULL,
    nurse_lname VARCHAR(50) NOT NULL,
    specialization VARCHAR(50),
    years_of_experience TINYINT,
    UNIQUE(nurse_id),
    UNIQUE(user_id)
);
