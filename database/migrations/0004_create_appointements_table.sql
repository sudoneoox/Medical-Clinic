CREATE TABLE IF NOT EXISTS appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTERVAL NOT NULL,
    reason TEXT NOT NULL,
    status appointment_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    CHECK (appointment_datetime > created_at)
);

CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);

CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);

CREATE INDEX idx_appointments_appointment_datetime ON appointments(appointment_datetime);