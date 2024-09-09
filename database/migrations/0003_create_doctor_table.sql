CREATE TABLE IF NOT EXISTS doctor (
    doctor_id SERIAL PRIMARY KEY,
    name name,
    license_number VARCHAR(50) NOT NULL,
    yoe INTEGER,
    -- years of experience
    specialty VARCHAR(50) [],
    officeLocations office [],
) INHERITS (users);