-- holds a ptr to the user_id to distinguish between patients and doctors
-- we could maybe do a boolcase ? ie ids larger than 1000 are doctors ? 
-- patient table, extends user
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL, -- fk
    patient_name VARCHAR(50) NOT NULL,
    emergency_contacts JSON 
);