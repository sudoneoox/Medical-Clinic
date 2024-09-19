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

GRANT SELECT ON nurse_patient_view TO nurse;

-- give the receptionist access to the view
GRANT SELECT ON receptionist_appointment_view TO receptionist;
GRANT SELECT, INSERT, UPDATE ON appointments TO receptionist;
GRANT SELECT, INSERT ON appointment_notes TO receptionist;

-- give receptionist view to billing
GRANT SELECT, UPDATE ON billing TO receptionist;


-- give the nurse access to the view
GRANT SELECT, INSERT, UPDATE ON appointments TO nurse;
GRANT SELECT, INSERT, UPDATE ON medical_records TO nurse;
GRANT SELECT, INSERT ON appointment_notes TO nurse;

--- give nurse and receptionist appointment notes permissions and views 
CREATE OR REPLACE VIEW nurse_appointment_notes_view AS
SELECT 
    an.note_id,
    an.appointment_id,
    an.note_text,
    an.created_at,
    n.nurse_id,
    n.nurse_name
FROM 
    appointment_notes an
JOIN 
    nurse n ON an.created_by_nurse = n.nurse_id
WHERE 
    an.created_by_nurse IS NOT NULL;

CREATE OR REPLACE VIEW receptionist_appointment_notes_view AS
SELECT 
    an.note_id,
    an.appointment_id,
    an.note_text,
    an.created_at,
    r.receptionist_id,
    r.receptionist_name
FROM 
    appointment_notes an
JOIN 
    receptionist r ON an.created_by_receptionist = r.receptionist_id
WHERE 
    an.created_by_receptionist IS NOT NULL;

-- Grant permissions for appointment notes
GRANT SELECT ON nurse_appointment_notes_view TO nurse;
GRANT SELECT ON receptionist_appointment_notes_view TO receptionist;
GRANT SELECT, INSERT, UPDATE ON appointment_notes TO nurse, receptionist;