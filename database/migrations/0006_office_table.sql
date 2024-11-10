--office locatios
CREATE TABLE IF NOT EXISTS office (
    office_id INT NOT NULL auto_increment primary key,
    office_name VARCHAR(50) NOT NULL,
    office_address VARCHAR(50) NOT NULL,
    office_phone VARCHAR(20),
    office_email VARCHAR(50),
    office_services JSON,
    UNIQUE(office_id),
    UNIQUE(office_address),
    UNIQUE(office_name)
);

-- Doctor-Office Relationship
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    is_primary_office TINYINT DEFAULT 0,
    effective_start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_end_date TIMESTAMP,
    schedule_type ENUM('REGULAR', 'TEMPORARY', 'ON_CALL') DEFAULT 'REGULAR',
    default_appointment_duration TIME DEFAULT '00:30:00',
    PRIMARY KEY (doctor_id, office_id, day_of_week)
);
