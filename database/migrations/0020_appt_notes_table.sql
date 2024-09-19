-- nurses and receptionist can modify this when they set up an appointmetn
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_notes_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_appointment_notes_user
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
