-- Billing table to keep track of payments for appointments
CREATE TABLE IF NOT EXISTS billing (
    billing_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL,
    amount_due DECIMAL NOT NULL,
    amount_paid DECIMAL NOT NULL DEFAULT 0,
    payment_status billing_status NOT NULL, -- PAID, NOT PAID, IN PROGRESS, CANCELLED, REFUNDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    CHECK (amount_due >= 0),
    CHECK (amount_paid >= 0)
);
