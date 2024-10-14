INSERT INTO valid_employees (employee_no, employee_role) VALUES
(1000, 'RECEPTIONIST'),
(1200, 'DOCTOR'),
(1400, 'NURSE');

-- sample users for logging in from the frontend with necessary relations as well
INSERT INTO users (user_username, user_password, user_email, user_phone, user_role, demographics_id) VALUES
('john_doe', 'abc', 'john.doe@email.com', '1234567890', 'PATIENT', 1),
('jane_smith', 'abc', 'jane.smith@email.com', '2345678901', 'DOCTOR', 2),
('bob_nurse', 'abc', 'bob.nurse@email.com', '3456789012', 'NURSE', 3),
('alice_receptionist', 'abc', 'alice.receptionist@email.com', '4567890123', 'RECEPTIONIST', 4);


INSERT INTO demographics (ethnicity_id, race_id, gender_id, dob) VALUES
(1, 5, 1, '1980-05-15'),
(2, 2, 2, '1975-09-22'),
(1, 3, 1, '1990-03-10'),
(3, 5, 2, '1985-12-01');

INSERT INTO patients (user_id, patient_fname, patient_lname, emergency_contacts) VALUES
(1, 'John', 'Doe', '{"name": "Jane Doe", "relationship": "Wife", "phone": "5678901234"}');

INSERT INTO doctors (doctor_employee_id, doctor_fname, doctor_lname, user_id, years_of_experience) VALUES
(1200, 'Jane', 'Smith', 2, 15);

INSERT INTO nurses (user_id, nurse_employee_id, nurse_fname, nurse_lname, specialization, years_of_experience) VALUES
(3, 1400, 'Bob', 'Johnson', 'Pediatrics', 8);

INSERT INTO receptionists (receptionist_employee_id, receptionist_fname, receptionist_lname, user_id) VALUES
(1000, 'Alice', 'Williams', 4);

