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

