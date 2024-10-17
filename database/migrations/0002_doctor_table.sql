-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doctor_employee_id INTEGER NOT NULL,
    doctor_fname VARCHAR(50) NOT NULL,
    doctor_lname VARCHAR(50) NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    years_of_experience TINYINT NOT NULL,
    -- CONSTRAINT chk_years_experience CHECK (years_of_experience > 0 AND years_of_experience < 90)
    UNIQUE(doctor_employee_id),
    UNIQUE(user_id)
); 
