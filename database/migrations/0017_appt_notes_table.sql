-- nurses and receptionist can modify this when they set up an appointment
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_nurse INTEGER,
    created_by_receptionist INTEGER,
    UNIQUE(note_id)
);