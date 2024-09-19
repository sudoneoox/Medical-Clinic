
CREATE TABLE IF NOT EXISTS nurse (
    nurse_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    nurse_name VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    specialization VARCHAR(50),
    years_of_experience INTEGER,
    CONSTRAINT fk_nurse_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_nurse_experience
        CHECK (years_of_experience >= 0 AND years_of_experience < 60)
);