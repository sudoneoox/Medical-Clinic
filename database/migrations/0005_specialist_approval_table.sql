-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    -- ids
    approval_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- unique id for each approval
    patient_id INTEGER NOT NULL,
    requesting_doctor_id INTEGER NOT NULL,
    specialist_id INTEGER NOT NULL,

    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    status specialist_request_status NOT NULL, -- PENDING, APPROVED, REJECTED

    CONSTRAINT fk_approval_patient
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_approval_requesting_doctor
        FOREIGN KEY (requesting_doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_approval_specialist
        FOREIGN KEY (specialist_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_specialist_request
        UNIQUE ( patient_id, requesting_doctor_id, specialist_id )
);