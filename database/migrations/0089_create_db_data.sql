INSERT INTO demographics (demographics_id, ethnicity_id, race_id, gender_id, dob) VALUES
(1, 1, 2, 1, '1980-05-15'),  -- Doctor Smith
(2, 2, 3, 2, '1975-09-22'),  -- Doctor Jones
(3, 1, 5, 2, '1990-03-10'),  -- Nurse Johnson
(4, 2, 4, 1, '1988-07-25'),  -- Receptionist Williams
(5, 1, 1, 1, '1995-12-03'),  -- Patient Brown
(6, 3, 5, 2, '1982-04-18');  -- Patient Davis

-- Insert users
INSERT INTO users (user_id, user_username, user_password, user_email, user_phone, user_role, demographics_id) VALUES
(1, 'dr.smith', 'abc', 'smith@hospital.com', '1234567890', 'DOCTOR', 1),
(2, 'dr.jones', 'abc', 'jones@hospital.com', '2345678901', 'DOCTOR', 2),
(3, 'nurse.johnson', 'abc', 'johnson@hospital.com', '3456789012', 'NURSE', 3),
(4, 'rec.williams', 'abc', 'williams@hospital.com', '4567890123', 'RECEPTIONIST', 4),
(5, 'patient.brown', 'abc', 'brown@email.com', '5678901234', 'PATIENT', 5),
(6, 'patient.davis', 'abc', 'davis@email.com', '6789012345', 'PATIENT', 6);

-- Insert valid employee numbers
INSERT INTO valid_employees (employee_no, employee_role) VALUES
(1201, 'DOCTOR'),
(1202, 'DOCTOR'),
(1401, 'NURSE'),
(1001, 'RECEPTIONIST');

-- Insert doctors
INSERT INTO doctors (doctor_employee_id, doctor_fname, doctor_lname, user_id, years_of_experience) VALUES
(1201, 'Sarah', 'Smith', 1, 15),
(1202, 'Michael', 'Jones', 2, 10);

-- Insert nurses
INSERT INTO nurses (nurse_employee_id, nurse_fname, nurse_lname, user_id, specialization, years_of_experience) VALUES
(1401, 'Emily', 'Johnson', 3, 'Pediatrics', 8);

-- Insert receptionists
INSERT INTO receptionists (receptionist_employee_id, receptionist_fname, receptionist_lname, user_id) VALUES
(1001, 'Jessica', 'Williams', 4);

-- Insert patients
INSERT INTO patients (user_id, patient_fname, patient_lname, emergency_contacts) VALUES
(5, 'Robert', 'Brown', '{"name": "Mary Brown", "relationship": "Wife", "phone": "7890123456"}'),
(6, 'Emma', 'Davis', '{"name": "John Davis", "relationship": "Husband", "phone": "8901234567"}');

-- Insert offices
INSERT INTO office (office_name, office_address, office_phone, office_email) VALUES
('Main Clinic', '123 Medical Ave', '9012345678', 'main@hospital.com'),
('North Branch', '456 Health St', '0123456789', 'north@hospital.com');

-- Insert appointments
INSERT INTO appointments (appointment_id, patient_id, doctor_id, office_id, appointment_datetime, duration, booked_by, attending_nurse, reason, status) VALUES
(1, 1, 1, 1, '2024-10-23 09:00:00', '01:00:00', 1, 1, 'Annual Checkup', 'CONFIRMED'),
(2, 2, 2, 2, '2024-10-23 10:30:00', '00:30:00', 1, 1, 'Follow-up', 'CONFIRMED'),
(3, 1, 2, 1, '2024-10-24 14:00:00', '01:00:00', 1, 1, 'Checkup', 'CONFIRMED'),
(4, 2, 2, 1, '2024-10-25 14:00:00', '01:00:00', 1, 1, 'Checkup', 'CONFIRMED'),
(5, 2, 2, 1, '2024-10-26 14:00:00', '01:00:00', 1, 1, 'Checkup', 'CONFIRMED'),
(6, 2, 2, 1, '2024-10-27 14:00:00', '01:00:00', 1, 1, 'Checkup', 'CONFIRMED');

-- Insert medical records
INSERT INTO medical_records (diagnosis, patient_id, doctor_id, appointment_id) VALUES
('Regular checkup - all clear', 1, 1, 1),
('Minor respiratory infection', 2, 2, 2),
('Schizophrenia', 2, 2, 3),
('PTSD', 2, 2, 4),
('Gonorrhea',2, 2, 5 ),
('Cancer Checkup', 2, 2, 6);

-- connect doctors to specialties
INSERT INTO doctor_specialties (doctor_id, specialty_code) VALUES
(1, 1),  -- Family Medicine
(2, 2);  -- Internal Medicine

-- connect doctors to offices
INSERT INTO doctor_offices (doctor_id, office_id, shift_start, shift_end) VALUES
(1, 1, '08:00:00', '17:00:00'),
(2, 2, '09:00:00', '18:00:00');

-- connect nurses to offices
INSERT INTO nurse_offices (nurse_id, office_id, shift_start, shift_end) VALUES
(1, 1, '08:00:00', '17:00:00');

-- connect receptionists to offices
INSERT INTO receptionist_offices (receptionist_id, office_id, shift_start, shift_end) VALUES
(1, 1, '08:00:00', '17:00:00');
