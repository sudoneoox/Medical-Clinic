-- Schedule an appointment
DELIMITER //
CREATE PROCEDURE schedule_appointment(
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_office_id INT,
    IN p_appointment_datetime DATETIME,
    IN p_duration TIME,
    IN p_reason VARCHAR(100),
    IN p_booked_by INT
)
BEGIN
    DECLARE doctor_available INT;
    
    -- check if doctor is available for time chosen
    SELECT COUNT(*) INTO doctor_available
    FROM appointments
    WHERE doctor_id = p_doctor_id
    AND appointment_datetime = p_appointment_datetime
    AND status = 'CONFIRMED';
    
    IF doctor_available = 0 THEN
        INSERT INTO appointments (
            patient_id, doctor_id, office_id, appointment_datetime, 
            duration, reason, booked_by, status
        ) VALUES (
            p_patient_id, p_doctor_id, p_office_id, p_appointment_datetime, 
            p_duration, p_reason, p_booked_by, 'CONFIRMED'
        );
        SELECT 'Appointment scheduled successfully' AS result;
    ELSE
        SELECT 'Doctor is not available at the chosen time' AS result;
    END IF;
END //
DELIMITER ;


-- cancel appointment
DELIMITER //
CREATE PROCEDURE cancel_appointment(
    IN p_appointment_id INT,
    IN p_cancellation_reason TEXT
)
BEGIN
    DECLARE appointment_exists INT;
    
    -- Check if the appointment exists and is not already cancelled
    SELECT COUNT(*) INTO appointment_exists
    FROM appointments
    WHERE appointment_id = p_appointment_id AND status != 'CANCELLED';
    
    IF appointment_exists > 0 THEN
        START TRANSACTION;
        
        UPDATE appointments 
        SET status = 'CANCELLED' 
        WHERE appointment_id = p_appointment_id;
        
        INSERT INTO appointment_cancellations (
            appointment_id, canceled_reason, canceled_at
        ) VALUES (
            p_appointment_id, p_cancellation_reason, NOW()
        );
        
        COMMIT;
        
        SELECT 'Appointment cancelled successfully' AS result;
    ELSE
        SELECT 'Appointment not found or already cancelled' AS result;
    END IF;
END //
DELIMITER ;

-- get patients upcoming appointments
DELIMITER //
CREATE PROCEDURE get_patient_upcoming_appointments(
    IN p_patient_id INT
)
BEGIN
    SELECT 
        a.appointment_id,
        a.appointment_datetime,
        a.duration,
        d.doctor_fname,
        d.doctor_lname,
        o.office_name,
        a.reason
    FROM 
        appointments a
    JOIN 
        doctors d ON a.doctor_id = d.doctor_id
    JOIN 
        office o ON a.office_id = o.office_id
    WHERE 
        a.patient_id = p_patient_id
    AND 
        a.appointment_datetime > NOW()
    AND 
        a.status = 'CONFIRMED'
    ORDER BY 
        a.appointment_datetime;
END //
DELIMITER ;


-- generates doctor availibility
DELIMITER //

CREATE PROCEDURE generate_doctor_weekly_schedule(
    IN p_doctor_id INT,
    IN p_office_id INT,
    IN p_start_time TIME,
    IN p_end_time TIME,
    IN p_days_of_week VARCHAR(500) -- Comma-separated list of days
)
BEGIN
    DECLARE day_name VARCHAR(20);
    DECLARE done BOOLEAN DEFAULT FALSE;
    DECLARE slot_id_var INT;
    
    -- Create cursor for days
    DECLARE day_cursor CURSOR FOR 
        SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(p_days_of_week, ',', numbers.n), ',', -1) day_name
        FROM (
            SELECT 1 + units.i + tens.i * 10 n
            FROM (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units,
                 (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) tens
            WHERE 1 + units.i + tens.i * 10 <= (LENGTH(p_days_of_week) - LENGTH(REPLACE(p_days_of_week, ',', '')) + 1)
        ) numbers;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    START TRANSACTION;
    
    -- For each day
    OPEN day_cursor;
    
    day_loop: LOOP
        FETCH day_cursor INTO day_name;
        IF done THEN
            LEAVE day_loop;
        END IF;
        
        -- For each time slot that falls within the doctor's availability
        INSERT INTO doctor_availability (doctor_id, office_id, day_of_week, slot_id, is_available)
        SELECT 
            p_doctor_id,
            p_office_id,
            TRIM(day_name),
            ts.slot_id,
            TRUE
        FROM 
            time_slots ts
        WHERE 
            ts.start_time >= p_start_time 
            AND ts.end_time <= p_end_time;
            
    END LOOP;
    
    CLOSE day_cursor;
    
    COMMIT;
END //

DELIMITER ;
