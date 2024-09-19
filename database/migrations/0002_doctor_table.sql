-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    doctor_name VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    specialties VARCHAR(30) [],
    years_of_experience INTEGER,
    CONSTRAINT fk_doctor_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) -- on delete delete the referenced row as well
        ON DELETE CASCADE,
    CHECK (years_of_experience > 0 AND years_of_experience < 90)
);