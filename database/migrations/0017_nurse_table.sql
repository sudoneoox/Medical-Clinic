CREATE TABLE IF NOT EXISTS nurse (
    nurse_id INT,
    user_id INT UNIQUE NOT NULL,
    nurse_name VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    specialization VARCHAR(50),
    years_of_experience INT,
    CONSTRAINT chk_nurse_experience
        CHECK (years_of_experience >= 0 AND years_of_experience < 60)
)