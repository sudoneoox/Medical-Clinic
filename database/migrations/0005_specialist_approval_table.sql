-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- unique id for each approval
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    specialist_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING' -- PENDING, APPROVED, REJECTED
    patient_id INTEGER NOT NULL,
    requesting_doctor_id INTEGER NOT NULL,
    -- the primary doctor of the patient or the doctor requesting the specialist
    specialist_id INTEGER NOT NULL,
);