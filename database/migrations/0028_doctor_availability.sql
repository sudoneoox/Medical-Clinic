CREATE TABLE IF NOT EXISTS doctor_availability (
    availability_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    slot_id INTEGER NOT NULL,
    is_available TINYINT DEFAULT 1,
    recurrence_type ENUM('WEEKLY', 'ONE_TIME') DEFAULT 'WEEKLY',
    specific_date DATE NULL, -- Only used when recurrence_type is ONE_TIME
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_availability (doctor_id, office_id, day_of_week, slot_id, specific_date)
);
