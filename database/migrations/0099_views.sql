-- allows the receptionist to see appointment information without revealing the patients medical record
CREATE VIEW receptionist_appointment_view AS
SELECT 
    a.appointment_id,
    a.patient_id,
    p.patient_name,
    a.doctor_id,
    d.doctor_name,
    a.office_id,
    a.appointment_datetime,
    a.duration,
    a.reason,
    a.status,
    a.booked_by,
    a.attending_nurse
FROM 
    appointments a
JOIN 
    patient p ON a.patient_id = p.patient_id
JOIN 
    doctor d ON a.doctor_id = d.doctor_id;

-- nurse view to see patient information
CREATE VIEW nurse_patient_view AS
SELECT 
    p.patient_id,
    p.patient_name,
    p.emergency_contacts,
    mr.diagnosis,
    mr.notes,
    mr.test_results
FROM 
    patient p
LEFT JOIN 
    medical_records mr ON p.patient_id = mr.patient_id;

GRANT SELECT ON nurse_patient_view TO NURSE;

-- give the receptionist access to the view
GRANT SELECT ON receptionist_appointment_view TO RECEPTIONIST;
GRANT SELECT, INSERT, UPDATE ON appointments TO RECEPTIONIST;
GRANT SELECT, INSERT ON appointment_notes TO RECEPTIONIST;

-- give receptionist view to billing
GRANT SELECT, UPDATE ON billing TO RECEPTIONIST;


-- give the nurse access to the view
GRANT SELECT, INSERT, UPDATE ON appointments TO NURSE;
GRANT SELECT, INSERT, UPDATE ON medical_records TO NURSE;
GRANT SELECT, INSERT ON appointment_notes TO NURSE;

