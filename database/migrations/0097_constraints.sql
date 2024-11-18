
ALTER TABLE appointments
ADD CONSTRAINT chk_appointment_duration 
CHECK (TIME_TO_SEC(duration) > 0);

-- doctors yoe is within a range
ALTER TABLE doctors
ADD CONSTRAINT chk_doctor_experience 
CHECK (years_of_experience >= 0 AND years_of_experience <= 70);

-- billing amts are non negative
ALTER TABLE billing
ADD CONSTRAINT chk_billing_amounts 
CHECK (amount_due >= 0 AND amount_paid >= 0);


ALTER TABLE doctor_offices
ADD CONSTRAINT chk_doctor_shift_times
CHECK (shift_start < shift_end);

ALTER TABLE nurse_offices
ADD CONSTRAINT chk_nurse_shift_times
CHECK (shift_start < shift_end);

ALTER TABLE receptionist_offices
ADD CONSTRAINT chk_receptionist_shift_times
CHECK (shift_start < shift_end);


-- delimeter constraints

-- appointments are in the future not before present (insert constraint)
DELIMITER //
CREATE TRIGGER before_appointment_insert 
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    IF NEW.appointment_datetime <= NOW() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Appointment must be scheduled for a future date and time';
    END IF;
END //
DELIMITER ;




