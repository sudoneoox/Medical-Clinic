-- holds a ptr to the user_id to distinguish between patients and doctors
-- we could maybe do a boolcase ? ie ids larger than 1000 are doctors ? 

-- patient table, extends user
CREATE TABLE IF NOT EXISTS patient (
    patient_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    patient_name name NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(30),
    ethnicities VARCHAR(50) [],
    address address,
    emergency_contacts emergency_contact [],
    primary_doctor_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (primary_doctor_id) REFERENCES doctor(doctor_id));