CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    is_primary_office TINYINT DEFAULT 0,
    effective_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_end_date DATE,
    schedule_type ENUM('REGULAR', 'TEMPORARY', 'ON_CALL') DEFAULT 'REGULAR',
    PRIMARY KEY (receptionist_id, office_id, day_of_week)
);
