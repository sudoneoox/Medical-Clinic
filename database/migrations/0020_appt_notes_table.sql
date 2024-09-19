-- nurses and receptionist can modify this when they set up an appointmetn
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by_nurse INTEGER,
    created_by_receptionist INTEGER,

    CONSTRAINT fk_appointment_notes_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_appointment_notes_nurse
        FOREIGN KEY (created_by_nurse)
        REFERENCES nurse(nurse_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_appointment_notes_receptionist
        FOREIGN KEY (created_by_receptionist)
        REFERENCES receptionist(receptionist_id)
        ON DELETE SET NULL,
    CONSTRAINT check_creator_type 
        CHECK (
            (created_by_nurse IS NOT NULL AND created_by_receptionist IS NULL) OR
            (created_by_nurse IS NULL AND created_by_receptionist IS NOT NULL)
        )
);
