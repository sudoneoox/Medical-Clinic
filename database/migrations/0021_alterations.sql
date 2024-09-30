-- modify medical record to allow nurses to update/create records
ALTER TABLE medical_records
ADD COLUMN created_by INT,
ADD COLUMN updated_by INT,


-- modify billing to allow receptionists to update
-- ALTER TABLE billing
-- ADD COLUMN handled_by INT,
-- ADD CONSTRAINT fk_billing_handled_by
--     FOREIGN KEY (handled_by)
--     REFERENCES users(user_id)
--     ON DELETE SET NULL;