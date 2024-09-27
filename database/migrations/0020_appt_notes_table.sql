-- nurses and receptionist can modify this when they set up an appointmetn
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_nurse INTEGER,
    created_by_receptionist INTEGER
    -- CONSTRAINT check_creator_type  -- not supported need trigger
    --     CHECK (
    --         (created_by_nurse IS NOT NULL AND created_by_receptionist IS NULL) OR
    --         (created_by_nurse IS NULL AND created_by_receptionist IS NOT NULL)
    --     )
);