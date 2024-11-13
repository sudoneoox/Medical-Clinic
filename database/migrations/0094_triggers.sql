
-- business constraint patient needs primary doctor approval
-- for specialist appointment
DELIMITER //
CREATE TRIGGER before_appointment_specialist_check
BEFORE INSERT ON appointments
FOR EACH ROW
specialist_check: BEGIN  
    -- store doctor status checks
    -- variable def.
    DECLARE is_specialist TINYINT(1);
    DECLARE is_primary_doctor TINYINT(1);
    
    -- if appointment is already pending approval skip validations
    IF NEW.status = 'PENDING_DOCTOR_APPROVAL' THEN
        LEAVE specialist_check;  -- exit at label def. 
    END IF;
    
    -- check if doctor is primary doctor
    -- if true returns 1 and sets it into the is_primary_doctor variable
    SELECT EXISTS (
        SELECT 1
        FROM patient_doctor_junction pdj
        WHERE pdj.patient_id = NEW.patient_id 
        AND pdj.doctor_id = NEW.doctor_id
        AND pdj.is_primary = 1
    ) INTO is_primary_doctor;
    
    -- if not primary doctor checks if the doctor is a specialist 
    -- if true sets 1 (true) to the is_specialist variable
    IF is_primary_doctor = 0 THEN
        SELECT EXISTS (
            SELECT 1
            FROM doctor_specialties ds
            WHERE ds.doctor_id = NEW.doctor_id
        ) INTO is_specialist;
        
        -- if the doctor is a specialist -> appointment needs approval 
        IF is_specialist = 1 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'SPECIALIST_APPROVAL_REQUIRED';
        END IF;
    ELSE
      -- if it is the patients primary doctor automatically confirm appointment
        SET NEW.status = 'CONFIRMED';
    END IF;
END //
DELIMITER ;

-- business constraint patient cant make appointments
-- if more than two bills are in pending or not paid
DELIMITER //

CREATE TRIGGER check_patient_unpaid_bills
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    -- store count of unpaid bills to variable DEClARE xxx
    DECLARE unpaid_count INT;
    
    -- count unpaid and inprogress bills for the patient
    -- counts distinct appointment_id so that we dont count multiple billing entries
    -- for the same appointment
    SELECT COUNT(DISTINCT appointment_id) INTO unpaid_count
    FROM billing
    WHERE patient_id = NEW.patient_id
    AND payment_status IN ('NOT PAID', 'IN PROGRESS');
    
    -- If patient has 3 or more unpaid bills, prevent new appointment
    IF unpaid_count >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'BILLING_LIMIT_REACHED';
    END IF;
END //

DELIMITER ;


-- Trigger dont allow duplicate appointment times
DELIMITER //

CREATE TRIGGER check_duplicate_appointments
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    -- store count of existing appointments
    DECLARE existing_count INT;
    -- check existing appointments for this doctor
    -- at the exact date and time
    -- doesnt count cancelled appointments
    SELECT COUNT(*) INTO existing_count
    FROM appointments
    WHERE doctor_id = NEW.doctor_id
    -- compare just the date part
    AND DATE(appointment_datetime) = DATE(NEW.appointment_datetime)
    -- compare just the time part
    AND TIME(appointment_datetime) = TIME(NEW.appointment_datetime)
    -- only do it for active appointments
    AND status != 'CANCELLED';
    
    -- if appointments overlap ie same time and date 
    -- raise trigger error
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'DUPLICATE_APPOINTMENT_TIME';
    END IF;
END//

DELIMITER ;
