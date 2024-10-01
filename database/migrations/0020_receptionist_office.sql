CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME,
    shift_end TIME,
    PRIMARY KEY (receptionist_id, office_id)
);