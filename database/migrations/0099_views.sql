-- Doctor Schedule View
CREATE OR REPLACE VIEW doctor_schedule AS
SELECT 
    d.doctor_id,
    d.doctor_fname,
    d.doctor_lname,
    a.appointment_id,
    a.appointment_datetime,
    a.duration,
    p.patient_fname,
    p.patient_lname,
    o.office_name
FROM 
    doctors d
JOIN appointments a ON d.doctor_id = a.doctor_id
JOIN 
    patients p ON a.patient_id = p.patient_id
JOIN 
    office o ON a.office_id = o.office_id
WHERE
    a.status = 'CONFIRMED'
ORDER BY
    d.doctor_id, a.appointment_datetime;


CREATE OR REPLACE VIEW current_doctor_schedules AS
SELECT 
    d.doctor_id,
    d.doctor_fname,
    d.doctor_lname,
    do.office_id,
    o.office_name,
    do.day_of_week,
    do.shift_start,
    do.shift_end,
    do.is_primary_office,
    do.schedule_type
FROM doctors d
JOIN doctor_offices do ON d.doctor_id = do.doctor_id
JOIN office o ON do.office_id = o.office_id
WHERE 
    do.effective_start_date <= CURRENT_DATE
    AND (do.effective_end_date IS NULL OR do.effective_end_date >= CURRENT_DATE)
ORDER BY 
    d.doctor_id,
    FIELD(do.day_of_week, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
    do.shift_start;


-- Pateint medical history view
CREATE OR REPLACE VIEW patient_medical_history AS
SELECT 
    p.patient_id,
    p.patient_fname,
    p.patient_lname,
    mr.record_id,
    mr.diagnosis,
    mr.created_at AS visit_date,
    d.doctor_fname AS attending_doctor_fname,
    d.doctor_lname AS attending_doctor_lname,
    pr.medication_name,
    pr.dosage,
    pr.frequency
FROM
    patients p
JOIN 
    medical_records mr ON p.patient_id = mr.patient_id
JOIN 
    doctors d ON mr.doctor_id = d.doctor_id
LEFT JOIN
    prescription pr ON mr.prescription_id = pr.prescription_id
WHERE
    mr.is_deleted = 0
ORDER BY 
    p.patient_id, mr.created_at DESC;

-- Offices
CREATE OR REPLACE VIEW office_attending AS
SELECT
    o.office_id,
    o.office_name,
    DATE(a.appointment_datetime) AS date,
    COUNT(a.appointment_id) AS appointment_count
FROM 
    office o
LEFT JOIN 
    appointments a ON o.office_id = a.office_id
WHERE 
    a.status = 'CONFIRMED'
GROUP BY
    o.office_id, o.office_name, DATE(a.appointment_datetime)
ORDER BY
    o.office_id, date;


-- get time slots for doctor availibility
CREATE OR REPLACE VIEW doctor_available_slots AS
WITH time_slots_json AS (
    SELECT 
        da.doctor_id,
        da.office_id,
        o.office_name,
        o.office_address,
        da.day_of_week,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'start_time', ts.start_time,
                'end_time', ts.end_time
            )
        ) as time_slots
    FROM 
        doctor_availability da
    JOIN 
        time_slots ts ON da.slot_id = ts.slot_id
    JOIN 
        office o ON da.office_id = o.office_id
    WHERE 
        da.is_available = TRUE
    GROUP BY 
        da.doctor_id, da.office_id, o.office_name, o.office_address, da.day_of_week
)
SELECT 
    doctor_id,
    office_id,
    office_name,
    office_address,
    day_of_week,
    time_slots
FROM time_slots_json;
