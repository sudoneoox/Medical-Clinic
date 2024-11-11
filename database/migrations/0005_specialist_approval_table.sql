-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    specialist_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    patient_id INTEGER NOT NULL,
    reffered_doctor_id INTEGER NOT NULL,
    specialist_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    appointment_requested_datetime TIMESTAMP NOT NULL,
    appointment_id INTEGER NOT NULL
);
