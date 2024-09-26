-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    doctor_name VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    years_of_experience TINYINT NOT NULL,
    CHECK (years_of_experience > 0 AND years_of_experience < 90)
);