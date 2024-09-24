-- include receptionist and nurse into the appointments table

ALTER TABLE appointments
ADD COLUMN booked_by INTEGER,
ADD COLUMN attending_nurse INTEGER,
ADD CONSTRAINT fk_appointment_booked_by
    FOREIGN KEY (booked_by)
    REFERENCES receptionist(receptionist_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_appointment_attending_nurse
    FOREIGN KEY (attending_nurse)
    REFERENCES nurse(nurse_id)
    ON DELETE SET NULL;