-- prescription information linked to a medical record
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_id INTEGER NOT NULL,
    medication_info medication NOT NULL,
    date_issued TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSONB,

    CONSTRAINT fk_prescription_medical_record
        FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id)
        ON DELETE CASCADE
);