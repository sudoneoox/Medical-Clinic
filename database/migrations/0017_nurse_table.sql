CREATE TABLE IF NOT EXISTS nurses (
    nurse_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL, 
    nurse_name VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    specialization VARCHAR(50),
    years_of_experience INTEGER
    -- CONSTRAINT chk_nurse_experience
        -- CHECK (years_of_experience >= 0 AND years_of_experience < 60) -- implement trigger not supported
);