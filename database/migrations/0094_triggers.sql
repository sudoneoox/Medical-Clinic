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
    DECLARE is_primary BOOLEAN;
    
    -- Check if the doctor is a specialist
    SELECT COUNT(*) > 0 INTO is_specialist
    FROM doctor_specialties ds
    WHERE ds.doctor_id = NEW.doctor_id;
    
    -- Check if the doctor is patient's primary
    SELECT COUNT(*) > 0 INTO is_primary
    FROM patient_doctor_junction pdj
    WHERE pdj.patient_id = NEW.patient_id 
    AND pdj.doctor_id = NEW.doctor_id
    AND pdj.is_primary = 1;
    
    -- If doctor is specialist and not primary, require approval
    IF is_specialist AND NOT is_primary THEN
        -- Get primary doctor ID
        SET @primary_doctor_id = (
            SELECT doctor_id 
            FROM patient_doctor_junction 
            WHERE patient_id = NEW.patient_id 
            AND is_primary = 1
            LIMIT 1
        );
        
        -- Create approval request
        INSERT INTO specialist_approvals (
            patient_id,
            reffered_doctor_id,
            specialist_id
        ) VALUES (
            NEW.patient_id,
            @primary_doctor_id,
            NEW.doctor_id
        );
        
        -- Set appointment status to pending
        SET NEW.status = 'PENDING';
    END IF;
END//

DELIMITER ;
