-- update_modified_column function is used to update the updated_at column for the patient table
CREATE
OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_modified_time BEFORE
UPDATE
    ON patient FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- function so only nurse and doctors can create medical records 
CREATE OR REPLACE FUNCTION check_medical_record_creator()
RETURNS TRIGGER AS $ $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE user_id = NEW.created_by 
        AND role IN ('DOCTOR', 'NURSE')
    ) THEN
        RAISE EXCEPTION 'EXCEPTION: Only doctors and nurses can create medical records';
    END IF;
    RETURN NEW;
END;
$ $ LANGUAGE plpgsql;

CREATE TRIGGER enforce_medical_record_creator
BEFORE INSERT ON medical_records
FOR EACH ROW
EXECUTE FUNCTION check_medical_record_creator();

-- make functions for constraint if patient can see specialist needs approval for doctor
-- make function to schedule appointment
-- make funciton to approve specialist request
-- make function to log changes to the audit log table
-- make function to cancel appointment
-- ...