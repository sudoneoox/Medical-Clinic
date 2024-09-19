CREATE TABLE IF NOT EXISTS appointment_cancellations (
    cancellation_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    appointment_id INTEGER NOT NULL,
    canceled_reason TEXT,
    canceled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cancellation_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
);