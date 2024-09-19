
-- modify medical record to allow nurses to update/create records
ALTER TABLE medical_records
ADD COLUMN created_by INTEGER,
ADD COLUMN updated_by INTEGER,
ADD CONSTRAINT fk_medical_records_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_medical_records_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL;

-- modify billing to allow receptionists to update
ALTER TABLE billing
ADD COLUMN handled_by INTEGER,
ADD CONSTRAINT fk_billing_handled_by
    FOREIGN KEY (handled_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL;