-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- unique id for each approval
    patient_id INTEGER NOT NULL,
    requesting_doctor_id INTEGER NOT NULL,
    specialist_id INTEGER NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    status specialist_request_status NOT NULL, -- PENDING, APPROVED, REJECTED
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (requesting_doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (specialist_id) REFERENCES doctor(doctor_id)
);