-- nurses and receptionist can modify this when they set up an appointmetn
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INT,
    appointment_id INT NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP CURRENT_TIMESTAMP,
    created_by_nurse INT,
    created_by_receptionist INT,
    CONSTRAINT check_creator_type 
        CHECK (
            (created_by_nurse IS NOT NULL AND created_by_receptionist IS NULL) OR
            (created_by_nurse IS NULL AND created_by_receptionist IS NOT NULL)
        )
);