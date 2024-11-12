DELIMITER //

CREATE TRIGGER check_daily_appointment_limit
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE daily_count INT;
    
    SELECT COUNT(*) INTO daily_count
    FROM appointments
    WHERE doctor_id = NEW.doctor_id
    AND DATE(appointment_datetime) = DATE(NEW.appointment_datetime)
    AND status != 'CANCELLED';
    
    IF daily_count >= 10 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Daily appointment limit reached for this doctor';
    END IF;
END //

DELIMITER ;




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
BEGIN
    DECLARE is_specialist BOOLEAN;
    DECLARE has_approval BOOLEAN;
    DECLARE is_primary_doctor BOOLEAN;

    -- Only run checks if status is not PENDING_DOCTOR_APPROVAL
    -- needed this for a dumbass bug i kept getting 
    IF NEW.status != 'PENDING_DOCTOR_APPROVAL' THEN
        -- Check if the doctor is a specialist
        SELECT COUNT(*) > 0 INTO is_specialist
        FROM doctor_specialties ds
        WHERE ds.doctor_id = NEW.doctor_id;
        
        -- Check if the doctor is patient's primary
        SELECT COUNT(*) > 0 INTO is_primary_doctor
        FROM patient_doctor_junction pdj
        WHERE pdj.patient_id = NEW.patient_id 
        AND pdj.doctor_id = NEW.doctor_id
        AND pdj.is_primary = 1;
        
        -- If specialist, check for approval
        IF is_specialist AND NOT is_primary_doctor THEN
            SELECT COUNT(*) > 0 INTO has_approval
            FROM specialist_approvals
            WHERE patient_id = NEW.patient_id
            AND specialist_id = NEW.doctor_id
            AND specialist_status = 'APPROVED';
            
            IF NOT has_approval THEN
              SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = "SPECIALIST_APPROVAL_REQUIRED";
            END IF;
        END IF;
    END IF;
END//
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
        SET MESSAGE_TEXT = 'BILLS_UNPAID_EXCEEDED';
    END IF;
END //

DELIMITER ;
