-- appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTERVAL NOT NULL,
    reason TEXT NOT NULL,
    status appointment_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_appointment_office
        FOREIGN KEY (office_id) 
        REFERENCES office(office_id)
        ON DELETE CASCADE,

    CONSTRAINT check_appointment_datetime
        CHECK (appointment_datetime > created_at)
);
