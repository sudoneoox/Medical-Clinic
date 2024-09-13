-- office locations
CREATE TABLE IF NOT EXISTS office  (
    office_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    address address NOT NULL,
    phone phone_num,
    email TEXT,
    services VARCHAR(50) [],

    CONSTRAINT chk_phone CHECK (
        phone IS NULL
        OR (phone).area_code IS NOT NULL
        AND (phone).phone_number IS NOT NULL
    ),
    CONSTRAINT chk_email CHECK (email IS NULL OR email LIKE '%@%')
);

-- Doctor-Office Relationship (many to many)
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (doctor_id, office_id),

    CONSTRAINT fk_doctor_office_doctor
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_doctor_office_office
        FOREIGN KEY (office_id)
        REFERENCES office(office_id)
        ON DELETE CASCADE
);