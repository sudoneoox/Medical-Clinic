-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER NOT NULL AUTO_INCREMENT,
    doctor_employee_id INTEGER NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    doctor_name VARCHAR(50) NOT NULL,
    years_of_experience TINYINT NOT NULL,
    PRIMARY KEY(doctor_id, doctor_employee_id),
    -- CONSTRAINT chk_years_experience CHECK (years_of_experience > 0 AND years_of_experience < 90)
    UNIQUE(doctor_employee_id),
    UNIQUE(user_id)
);
