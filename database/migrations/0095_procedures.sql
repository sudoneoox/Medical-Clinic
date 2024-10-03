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
        d.doctor_name,
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