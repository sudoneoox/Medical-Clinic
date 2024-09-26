--office locatios
CREATE TABLE IF NOT EXISTS office (
    office_id INT NOT NULL auto_increment primary key,
    office_name VARCHAR(50) NOT NULL,
    office_address VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(50),
    office_services VARCHAR(100)
);

-- Doctor-Office Relationship
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (doctor_id, office_id),
)