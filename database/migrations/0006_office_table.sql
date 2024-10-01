--office locatios
CREATE TABLE IF NOT EXISTS office (
    office_id INT NOT NULL auto_increment primary key,
    office_name VARCHAR(50) NOT NULL,
    office_address VARCHAR(50) NOT NULL,
    office_phone VARCHAR(20),
    office_email VARCHAR(50),
    office_services JSON
);

-- Doctor-Office Relationship
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    PRIMARY KEY (doctor_id, office_id)
);