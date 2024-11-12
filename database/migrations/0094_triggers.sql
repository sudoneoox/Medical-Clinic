
DELIMITER //

CREATE TRIGGER before_notification_insert 
BEFORE INSERT ON notifications
FOR EACH ROW
BEGIN
    IF NEW.expires_at IS NULL THEN
        SET NEW.expires_at = DATE_ADD(NEW.created_at, INTERVAL 30 DAY);
    END IF;
    IF NEW.scheduled_for IS NOT NULL AND NEW.scheduled_for < NEW.created_at THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Notification cannot be scheduled for a past date';
    END IF;
END //
DELIMITER ;




DELIMITER //
CREATE TRIGGER before_appointment_specialist_check
BEFORE INSERT ON appointments
FOR EACH ROW
label_name: BEGIN  -- Add a label
    DECLARE is_specialist TINYINT(1);
    DECLARE is_primary_doctor TINYINT(1);
    
    -- Skip all checks if this is already a pending approval request
    IF NEW.status = 'PENDING_DOCTOR_APPROVAL' THEN
        LEAVE label_name;  -- Use LEAVE instead of RETURN
    END IF;
    
    -- Rest of the trigger remains the same
    SELECT EXISTS (
        SELECT 1
        FROM patient_doctor_junction pdj
        WHERE pdj.patient_id = NEW.patient_id 
        AND pdj.doctor_id = NEW.doctor_id
        AND pdj.is_primary = 1
    ) INTO is_primary_doctor;
    
    IF is_primary_doctor = 0 THEN
        SELECT EXISTS (
            SELECT 1
            FROM doctor_specialties ds
            WHERE ds.doctor_id = NEW.doctor_id
        ) INTO is_specialist;
        
        IF is_specialist = 1 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'SPECIALIST_APPROVAL_REQUIRED';
        END IF;
    ELSE
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
    DECLARE unpaid_count INT;
    
    -- Count number of unpaid or in-progress bills for the patient
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


-- duplicate appoitment times
DELIMITER //

CREATE TRIGGER check_duplicate_appointments
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE existing_count INT;
    
    SELECT COUNT(*) INTO existing_count
    FROM appointments
    WHERE doctor_id = NEW.doctor_id
    AND DATE(appointment_datetime) = DATE(NEW.appointment_datetime)
    AND TIME(appointment_datetime) = TIME(NEW.appointment_datetime)
    AND status != 'CANCELLED';
    
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'DUPLICATE_APPOINTMENT_TIME';
    END IF;
END//

DELIMITER ;
