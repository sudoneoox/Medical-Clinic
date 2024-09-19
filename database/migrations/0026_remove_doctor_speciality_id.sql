ALTER TABLE doctor
DROP COLUMN specialty_id;

ALTER TABLE doctor
DROP CONSTRAINT fk_doctor_specialty;