-- Billing table to keep track of payments for appointments
CREATE TABLE IF NOT EXISTS billing (
    billing_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL,
    amount_due DECIMAL NOT NULL,
    amount_paid DECIMAL NOT NULL DEFAULT 0,
    -- PAID, NOT PAID, IN PROGRESS, CANCELLED, REFUNDED
    payment_status billing_status NOT NULL,
    billing_due DATE NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT fk_billing_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_billing_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    CONSTRAINT check_amount_due CHECK (amount_due >= 0),
    CONSTRAINT check_amount_paid CHECK (amount_paid >= 0),
    CHECK (
        payment_status IN (
            'PAID',
            'NOT PAID',
            'IN PROGRESS',
            'CANCELLED',
            'REFUNDED'
        )
    )
);