-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    doctor_name name,
    license_number VARCHAR(50) NOT NULL,
    specialties VARCHAR(50) [],
    years_of_experience INTEGER,
    CONSTRAINT fk_doctor_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) -- on delete delete the referenced row as well
        ON DELETE CASCADE
);