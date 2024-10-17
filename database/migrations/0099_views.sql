-- do complex views here
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



