-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,-- unique id for each approval
    patient_id INTEGER NOT NULL,
    requesting_doctor_id INTEGER NOT NULL, -- the primary doctor of the patient or the doctor requesting the specialist
    specialist_id INTEGER NOT NULL,

    requested_at DATE DEFAULT CURRENT_TIMESTAMP,
    approved_at DATE,
    specialist_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING' -- PENDING, APPROVED, REJECTED

    -- CONSTRAINT fk_approval_patient
    --     FOREIGN KEY (patient_id) 
    --     REFERENCES patient(patient_id)
    --     ON DELETE CASCADE,

    -- CONSTRAINT fk_approval_requesting_doctor
    --     FOREIGN KEY (requesting_doctor_id) 
    --     REFERENCES doctor(doctor_id)
    --     ON DELETE CASCADE,

    -- CONSTRAINT fk_approval_specialist
    --     FOREIGN KEY (specialist_id) 
    --     REFERENCES doctor(doctor_id)
    --     ON DELETE CASCADE,

    -- CONSTRAINT unique_specialist_request
    --     UNIQUE ( patient_id, requesting_doctor_id, specialist_id ),
    
    -- CHECK ( specialist_status IN ('PENDING', 'APPROVED', 'REJECTED') )
);