CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id NOT NULL INT,
    office_id NOT NULL INT,
    shift_start TIME,
    shift_end TIME,
    PRIMARY KEY (receptionist_id, office_id)
);