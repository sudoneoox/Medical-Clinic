SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(50) UNIQUE NOT NULL,
    -- long passwd in case we want to hash? 
    user_password VARCHAR(200) NOT NULL,
    user_email VARCHAR(50) UNIQUE NOT NULL,
    user_phone VARCHAR(20) UNIQUE NOT NULL,
    account_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role ENUM(
        "ADMIN",
        "PATIENT",
        "DOCTOR",
        "RECEPTIONIST",
        "NURSE"
    ) NOT NULL,
    demographics_id INTEGER NOT NULL,
    portal_last_login TIMESTAMP,
    UNIQUE(user_id),
    UNIQUE(user_email),
    UNIQUE(user_username)
);
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doctor_employee_id INTEGER NOT NULL,
    doctor_fname VARCHAR(50) NOT NULL,
    doctor_lname VARCHAR(50) NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    years_of_experience TINYINT NOT NULL,
    -- CONSTRAINT chk_years_experience CHECK (years_of_experience > 0 AND years_of_experience < 90)
    UNIQUE(doctor_employee_id),
    UNIQUE(user_id)
); 
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    patient_fname VARCHAR(50) NOT NULL,
    patient_lname VARCHAR(50) NOT NULL,
    emergency_contacts JSON,
    UNIQUE(user_id)
);
CREATE TABLE IF NOT EXISTS patient_doctor_junction (
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    is_primary TINYINT DEFAULT 0,
    PRIMARY KEY (patient_id, doctor_id)
);

CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    specialist_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    patient_id INTEGER NOT NULL,
    reffered_doctor_id INTEGER NOT NULL,
    specialist_id INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS office (
    office_id INT NOT NULL auto_increment primary key,
    office_name VARCHAR(50) NOT NULL,
    office_address VARCHAR(50) NOT NULL,
    office_phone VARCHAR(20),
    office_email VARCHAR(50),
    office_services JSON,
    UNIQUE(office_id),
    UNIQUE(office_address),
    UNIQUE(office_name)
);

CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    PRIMARY KEY (doctor_id, office_id)
);
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime TIMESTAMP NOT NULL,
    duration TIME NOT NULL,
    booked_by INTEGER NULL,
    attending_nurse INTEGER NULL,
    reason VARCHAR(100),
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW') NOT NULL,
    -- Changed to ENUM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS billing (
    billing_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL,
    amount_due DECIMAL(7, 2) NOT NULL,
    amount_paid DECIMAL(7, 2) NOT NULL DEFAULT 0,
    payment_status ENUM(
        'PAID',
        'NOT PAID',
        'IN PROGRESS',
        'CANCELLED',
        'REFUNDED'
    ) NOT NULL,
    billing_due TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    handled_by INTEGER,
    UNIQUE(billing_id)
);
CREATE TABLE IF NOT EXISTS insurances (
    insurance_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    insurance_info JSON,
    is_active TINYINT DEFAULT (1),
    UNIQUE(insurance_id)
);
CREATE TABLE IF NOT EXISTS medical_records (
    -- primary keys
    record_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- dateissued
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- in case of any updates on diagnosis or changes 
    diagnosis VARCHAR(100),
    is_deleted TINYINT DEFAULT (0),
    deleted_at TIMESTAMP NULL,
    -- foreign keys other entities
    prescription_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    UNIQUE(record_id)
);
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INTEGER NOT NULL,
    medication_name VARCHAR(50) NOT NULL,
    dosage VARCHAR(20) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    duration VARCHAR(50) NOT NULL,  -- MySQL doesn't have an INTERVAL type
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSON,
    UNIQUE(prescription_id)
);
CREATE TABLE IF NOT EXISTS race_code (
    race_code TINYINT NOT NULL ,
    race_text VARCHAR(50) NOT NULL ,
    UNIQUE(race_code),
    UNIQUE(race_text),
    PRIMARY KEY(race_code, race_text)
);

CREATE TABLE IF NOT EXISTS gender_code (
    gender_code TINYINT NOT NULL ,
    gender_text VARCHAR(50) NOT NULL ,
    UNIQUE(gender_code),
    UNIQUE(gender_text),
    PRIMARY KEY (gender_code, gender_text)
);

CREATE TABLE IF NOT EXISTS ethnicity_code (
    ethnicity_code TINYINT NOT NULL ,
    ethnicity_text VARCHAR(50) NOT NULL ,
    UNIQUE(ethnicity_code),
    UNIQUE(ethnicity_text),
    PRIMARY KEY (ethnicity_code, ethnicity_text)
);

CREATE TABLE IF NOT EXISTS demographics (
    demographics_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ethnicity_id TINYINT NULL,
    race_id TINYINT NULL,
    gender_id TINYINT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_at DATE
); 
CREATE TABLE IF NOT EXISTS specialties_code (
    specialty_code TINYINT NOT NULL PRIMARY KEY,
    specialty_name VARCHAR(30) NOT NULL,
    specialty_desc VARCHAR(500),
    UNIQUE(specialty_code),
    UNIQUE(specialty_name)
);
CREATE TABLE IF NOT EXISTS receptionists (
    receptionist_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    receptionist_employee_id INTEGER NOT NULL,
    receptionist_fname VARCHAR(50) NOT NULL,
    receptionist_lname VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL, -- fk
    UNIQUE(receptionist_id),
    UNIQUE(user_id)
);
CREATE TABLE IF NOT EXISTS nurses (
    nurse_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    nurse_employee_id INTEGER NOT NULL,
    nurse_fname VARCHAR(50) NOT NULL,
    nurse_lname VARCHAR(50) NOT NULL,
    specialization VARCHAR(50),
    years_of_experience TINYINT,
    UNIQUE(nurse_id),
    UNIQUE(user_id)
);
CREATE TABLE IF NOT EXISTS nurse_offices (
    nurse_id INT NOT NULL,
    office_id INT NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    PRIMARY KEY (nurse_id, office_id)
);
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_nurse INTEGER,
    created_by_receptionist INTEGER,
    UNIQUE(note_id)
);
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INTEGER NOT NULL,
    specialty_code TINYINT NOT NULL,
    PRIMARY KEY (doctor_id, specialty_code)
);
CREATE TABLE IF NOT EXISTS appointment_cancellations (
    cancellation_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    canceled_reason TEXT,
    canceled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cancellation_id),
    UNIQUE(appointment_id)
);
CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME,
    shift_end TIME,
    PRIMARY KEY (receptionist_id, office_id)
);
CREATE TABLE IF NOT EXISTS test_results (
    -- primary keys
    test_results_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    test_type ENUM('BLOOD', 'XRAY', 'URINE'),
    test_name VARCHAR(30),
    test_conducted_date DATE,
    test_result JSON,
    test_units VARCHAR(10),
    test_interpretation ENUM("BELOW", "NORMAL", "ABOVE"),
    test_status ENUM("PENDING", "COMPLETED"),
    -- foreign keys
    test_performed_by INTEGER NOT NULL,
    medical_record_id INTEGER NOT NULL,
    UNIQUE(test_results_id)
);
CREATE TABLE IF NOT EXISTS appointment_reminders (
    reminder_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    reminder_status ENUM('Pending', 'Sent', 'Failed') NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    sent_time TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS detailed_allergies (
    allergy_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    medical_record_id INTEGER NOT NULL,
    allergy_type ENUM('FOOD', 'MEDICATION', 'ENVIRONMENTAL') NOT NULL,
    allergen VARCHAR(100) NOT NULL,
    reaction TEXT,
    severity ENUM('MILD', 'MODERATE', 'SEVERE') NOT NULL,
    onset_date DATE
);
CREATE TABLE IF NOT EXISTS valid_employees (
  employee_no INT NOT NULL UNIQUE PRIMARY KEY,
  employee_role ENUM('DOCTOR', 'RECEPTIONIST', 'NURSE', 'ADMIN') NOT NULL
);
CREATE TABLE IF NOT EXISTS notes (
    note_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    subject VARCHAR(100),
    description TEXT,
    is_deleted TINYINT DEFAULT (0),
    deleted_at TIMESTAMP NULL,
    medical_record_id INTEGER NOT NULL,
    UNIQUE(note_id)
);
INSERT INTO race_code (race_code, race_text) VALUES
(1, 'American Indian or Alaska Native'),
(2, 'Asian'),
(3, 'Black or African American'),
(4, 'Native Hawaiian or Other Pacific Islander'),
(5, 'White'),
(6, 'Other'),
(7, 'Prefer not to say');

INSERT INTO gender_code (gender_code, gender_text) VALUES
(1, 'Male'),
(2, 'Female'),
(3, 'Non-binary'),
(4, 'Prefer not to say'),
(5, 'Other');

INSERT INTO ethnicity_code (ethnicity_code, ethnicity_text) VALUES
(1, 'Hispanic or Latino'),
(2, 'Not Hispanic or Latino'),
(3, 'Prefer not to say');
INSERT INTO specialties_code (specialty_code, specialty_name, specialty_desc) VALUES 
(1, 'Family Medicine', 'Comprehensive care for all ages, focusing on prevention, diagnosis, and treatment of a wide range of health conditions'),
(2, 'Internal Medicine', 'Expert care in diagnosing, treating, and preventing complex adult diseases and chronic conditions'),
(3, 'Pediatrics','Pediatric care specializing in the diagnosis, treatment, and prevention of health conditions in infants, children, and adolescents'),
(4, 'Obstetrics and Gynecology', 'Comprehensive care for women reproductive health, including pregnancy, childbirth, and gynecological disorders'),
(5, 'General Surgery','Specialized surgical care for a wide range of conditions, focusing on the abdomen, breast, skin, and soft tissues'),
(6, 'Psychiatry','Comprehensive mental health care, specializing in the diagnosis, treatment, and prevention of psychiatric disorders'),
(7, 'Cardiology','Specialized care for heart and vascular conditions, focusing on diagnosis, treatment, and prevention of cardiovascular diseases'),
(8, 'Dermatology','Expert care for skin, hair, and nail conditions, providing diagnosis, treatment, and prevention of dermatological disorders'),
(9, 'Orthopedics','Comprehensive care for musculoskeletal conditions, specializing in the diagnosis, treatment, and rehabilitation of bones, joints, and muscles'),
(10, 'Neurology','Specialized care for disorders of the brain, spinal cord, and nervous system, focusing on diagnosis and treatment of neurological conditions'),
(11, 'Oncology','Advanced oncology services providing compassionate care, innovative treatments, and comprehensive support for patients facing cancer'),
(12, 'Emergency Medicine','Rapid-response emergency medicine services delivering critical care and life-saving interventions for patients in urgent need'),
(13, 'Gastroenterology','Specialized gastroenterology services focused on diagnosing and treating digestive disorders with a patient-centered approach and advanced therapeutic options'),
(14, 'Endocrinology','Expert endocrinology services dedicated to diagnosing and managing hormonal disorders, ensuring personalized treatment plans for optimal health'),
(15, 'Urology','Comprehensive urology services providing expert diagnosis and treatment for a wide range of urinary and reproductive health conditions');

INSERT INTO valid_employees (employee_no, employee_role) VALUES
(1000, 'RECEPTIONIST'),
(1001, 'RECEPTIONIST'),
(1002, 'RECEPTIONIST'),
(1200, 'DOCTOR'),
(1201, 'DOCTOR'),
(1202, 'DOCTOR'),
(1400, 'NURSE'),
(1401, 'NURSE'),
(1402, 'NURSE');

INSERT INTO users (user_username, user_password, user_email, user_phone, user_role, demographics_id) VALUES
('john_doe', 'abc', 'john.doe@email.com', '1234567890', 'PATIENT', 1),
('jane_smith', 'abc', 'jane.smith@email.com', '2345678901', 'DOCTOR', 2),
('bob_nurse', 'abc', 'bob.nurse@email.com', '3456789012', 'NURSE', 3),
('alice_receptionist', 'abc', 'alice.receptionist@email.com', '4567890123', 'RECEPTIONIST', 4),
('linda_green', 'password123', 'linda.green@email.com', '4567891123', 'PATIENT', 5),
('james_white', 'password123', 'james.white@email.com', '5678901234', 'PATIENT', 6),
('emily_clark', 'password123', 'emily.c@email.com', '6789012345', 'DOCTOR', 7),
('michael_brown', 'password123', 'michael.b@email.com', '7890123456', 'DOCTOR', 8),
('anna_smith', 'password123', 'anna.s@email.com', '8901234567', 'NURSE', 9),
('john_keneth', 'password123', 'john.keneth@email.com', '9012345678', 'NURSE', 10),
('sarah_johnson', 'password123', 'sarah.j@email.com', '0123456789', 'RECEPTIONIST', 11),
('mark_lee', 'password123', 'mark.l@email.com', '1234567891', 'RECEPTIONIST', 12);


INSERT INTO demographics (ethnicity_id, race_id, gender_id, dob) VALUES
(1, 5, 1, '1980-05-15'),
(2, 2, 2, '1975-09-22'),
(1, 3, 1, '1990-03-10'),
(3, 5, 2, '1985-12-01'),
(1, 4, 2, '1988-11-05'),  
(2, 5, 1, '1979-12-12'),
(1, 1, 1, '1980-06-25'),
(2, 2, 2, '1975-04-12'),
(3, 3, 1, '1983-05-30'),
(1, 4, 2, '1990-08-15'),
(2, 5, 1, '1982-12-01'), 
(1, 1, 2, '1995-03-20');

INSERT INTO patients (user_id, patient_fname, patient_lname, emergency_contacts) VALUES
(1, 'John', 'Doe', '{"name": "Jane Doe", "relationship": "Wife", "phone": "5678901234"}'),
(2, 'Linda', 'Green', '{"name": "Tom Green", "relationship": "Brother", "phone": "8901234567"}'),
(3, 'James', 'White', '{"name": "Emily White", "relationship": "Mother", "phone": "9012345678"}');

INSERT INTO doctors (doctor_employee_id, doctor_fname, doctor_lname, user_id, years_of_experience) VALUES
(1200, 'Jane', 'Smith', 2, 15),
(1201, 'Emily', 'Clark', 7, 10),
(1202, 'Michael', 'Brown', 8, 15);

INSERT INTO nurses (user_id,nurse_employee_id,nurse_fname,nurse_lname,specialization,years_of_experience) VALUES
(3,1400,'Bob','Johnson','Pediatrics',8),
(9,1401,'Anna','Smith','Pediatrics',5),
(10,1402,'John','Keneth','Emergency Care',3);

INSERT INTO receptionists (receptionist_employee_id,receptionist_fname,receptionist_lname,user_id) VALUES
(1000,'Alice','Williams',4),
(1001,'Sarah','Johnson',11),
(1002,'Mark','Lee',12);

INSERT INTO office (office_name, office_address, office_phone, office_email, office_services) VALUES 
('Houston', '123 Health St, Houston, TX', '713-555-0101', 'houston@medicalclinic.com', JSON_OBJECT('services', JSON_ARRAY('Family Medicine', 'Pediatrics','Obstetrics and Gynecology','General Surgery','Cardiology'))),
('Katy', '456 Oakwood Ave, Houston, TX', '713-555-0222', 'katy@medicalclinic.com', JSON_OBJECT('services', JSON_ARRAY('Family Medicine', 'Orthopedics','Psychiatry','Oncology','Dermatology'))),
('Sugarland', '789 Heights Blvd, Houston, TX', '713-555-0333', 'sugarland@medicalclinic.com', JSON_OBJECT('services', JSON_ARRAY('Family Medicine', 'Pediatrics', 'Neurology'))),
('Missouri City', '321 Uptown Dr, Houston, TX', '713-555-0444', 'missouricity@medicalclinic.com', JSON_OBJECT('services', JSON_ARRAY('Family Medicine', 'Cardiology', 'Emergency Medicine'))),
('Pearland', '654 Riverside Dr, Houston, TX', '713-555-0555', 'pearland@medicalclinic.com', JSON_OBJECT('services', JSON_ARRAY('Family Medicine', 'Dermatology','Gastroenterology','Urology','Endocrinology')));

INSERT INTO doctor_offices (doctor_id,office_id,shift_start,shift_end) VALUES
(1,1,'08:00:00','13:00:00'),
(1,3,'14:00:00','18:00:00'),
(16,2,'09:00:00','17:00:00'),
(17,4,'09:00:00','19:00:00');

INSERT INTO nurse_offices (nurse_id,office_id,shift_start,shift_end) VALUES
(1,3,'09:00:00','17:00:00'),
(2,1,'08:00:00','16:00:00'),
(3,2,'09:00:00','17:00:00');

INSERT INTO appointments (patient_id,doctor_id,office_id,appointment_datetime,duration,booked_by,attending_nurse,reason,status,created_at,updated_at) VALUES
(1,1,1,'2024-12-01 10:00:00','01:00:00',1,NULL,'Routine check-up','CONFIRMED','2024-10-21 02:31:08','2024-10-21 02:31:08'),
(2,16,1,'2024-12-04 14:00:00','01:15:00',2,NULL,'Annual physical exam','CONFIRMED','2024-10-21 02:31:08','2024-10-21 02:31:08'),
(3,17,2,'2024-12-05 15:30:00','00:30:00',3,NULL,'Consultation','CONFIRMED','2024-10-21 02:31:08','2024-10-21 02:31:08');

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
CREATE INDEX idx_users_role ON users(user_role);
CREATE INDEX idx_users_email ON users(user_email);

CREATE INDEX idx_doctors_fname ON doctors(doctor_fname);
CREATE INDEX idx_doctors_lname ON doctors(doctor_lname);

CREATE INDEX idx_patients_fname ON patients(patient_fname);
CREATE INDEX idx_patients_lname ON patients(patient_lname);

CREATE INDEX idx_nurse_fname ON nurses(nurse_fname);
CREATE INDEX idx_nurse_lname ON nurses(nurse_lname);

CREATE INDEX idx_receptionist_fname ON receptionists(receptionist_fname);
CREATE INDEX idx_receptionist_lname ON receptionists(receptionist_lname);

CREATE INDEX idx_appointments_datetime ON appointments(appointment_datetime);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_patient_doctor ON appointments(patient_id, doctor_id);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_date ON medical_records(created_at);

CREATE INDEX idx_prescription_medication ON prescription(medication_name);

CREATE INDEX idx_billing_patient ON billing(patient_id);
CREATE INDEX idx_billing_status ON billing(payment_status);

CREATE INDEX idx_insurances_patient ON insurances(patient_id);
CREATE INDEX idx_insurances_active ON insurances(is_active);

CREATE INDEX idx_office_name ON office(office_name);

CREATE INDEX idx_specialist_approvals_status ON specialist_approvals(specialist_status);
CREATE INDEX idx_specialist_approvals_patient ON specialist_approvals(patient_id);

CREATE INDEX idx_appointment_reminders_status ON appointment_reminders(reminder_status);
CREATE INDEX idx_appointment_reminders_scheduled ON appointment_reminders(scheduled_time);

CREATE INDEX idx_detailed_allergies_type ON detailed_allergies(allergy_type);
CREATE INDEX idx_detailed_allergies_allergen ON detailed_allergies(allergen);

CREATE INDEX idx_test_results_type ON test_results(test_type);
CREATE INDEX idx_test_results_status ON test_results(test_status);
CREATE INDEX idx_test_results_date ON test_results(test_conducted_date);

CREATE INDEX idx_demographics_dob ON demographics(dob);

CREATE INDEX idx_patient_doctor_junction ON patient_doctor_junction(patient_id, doctor_id);
CREATE INDEX idx_doctor_specialties ON doctor_specialties(doctor_id, specialty_code);
CREATE INDEX idx_doctor_offices ON doctor_offices(doctor_id, office_id);
CREATE INDEX idx_nurse_offices ON nurse_offices(nurse_id, office_id);
CREATE INDEX idx_receptionist_offices ON receptionist_offices(receptionist_id, office_id);

ALTER TABLE appointments
ADD CONSTRAINT chk_appointment_duration 
CHECK (TIME_TO_SEC(duration) > 0);

ALTER TABLE doctors
ADD CONSTRAINT chk_doctor_experience 
CHECK (years_of_experience >= 0 AND years_of_experience <= 70);

ALTER TABLE billing
ADD CONSTRAINT chk_billing_amounts 
CHECK (amount_due >= 0 AND amount_paid >= 0);


DELIMITER //
CREATE TRIGGER before_appointment_insert 
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    IF NEW.appointment_datetime <= NOW() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Appointment must be scheduled for a future date and time';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_appointment_notes_creator
BEFORE INSERT ON appointment_notes
FOR EACH ROW
BEGIN
    IF NOT ((NEW.created_by_nurse IS NOT NULL AND NEW.created_by_receptionist IS NULL) OR
            (NEW.created_by_nurse IS NULL AND NEW.created_by_receptionist IS NOT NULL)) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Appointment note must be created by either a nurse or a receptionist, not both or neither';
    END IF;
END //
DELIMITER ;
ALTER TABLE users
ADD CONSTRAINT fk_user_demographics_id
    FOREIGN KEY (demographics_id)
    REFERENCES demographics(demographics_id)
    ON DELETE CASCADE;

ALTER TABLE doctors
ADD CONSTRAINT fk_doctor_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

ALTER TABLE patients
ADD CONSTRAINT fk_patient_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

ALTER TABLE patient_doctor_junction
ADD CONSTRAINT fk_patient_doctor_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_patient_doctor_doctor
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE;

ALTER TABLE specialist_approvals
ADD CONSTRAINT fk_approval_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_approval_requesting_doctor
    FOREIGN KEY (reffered_doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_approval_specialist
    FOREIGN KEY (specialist_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE;

ALTER TABLE appointments
ADD CONSTRAINT fk_appointment_patient 
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_appointment_doctor 
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_appointment_booked_by
    FOREIGN KEY (booked_by)
    REFERENCES receptionists(receptionist_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_appointment_attending_nurse
    FOREIGN KEY (attending_nurse)
    REFERENCES nurses(nurse_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_appointment_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;


ALTER TABLE appointment_reminders
ADD CONSTRAINT fk_appointment_reminder_appointment_id
    FOREIGN KEY(appointment_id)
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE;


ALTER TABLE billing
ADD CONSTRAINT fk_billing_patient 
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_billing_appointment 
    FOREIGN KEY (appointment_id) 
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_billing_handled_by
    FOREIGN KEY (handled_by)
    REFERENCES receptionists(receptionist_id)
    ON DELETE SET NULL;

ALTER TABLE insurances
ADD CONSTRAINT fk_insurance_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE;

ALTER TABLE medical_records
ADD CONSTRAINT fk_medical_record_patient 
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_medical_record_doctor 
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_medical_record_appointment 
    FOREIGN KEY (appointment_id) 
    REFERENCES appointments(appointment_id)
    ON DELETE SET NULL;

ALTER TABLE prescription
ADD CONSTRAINT fk_prescription_medical_record_id
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE;

ALTER TABLE test_results
ADD CONSTRAINT fk_test_results_medical_record_id
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_test_results_performed_by_id
    FOREIGN KEY (test_performed_by)
    REFERENCES nurses(nurse_id)
    ON DELETE CASCADE;

ALTER TABLE detailed_allergies
    ADD CONSTRAINT fk_detailed_allergens_record
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE;

ALTER TABLE notes
    ADD CONSTRAINT fk_notes_medical_record
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE;

ALTER TABLE demographics
ADD CONSTRAINT fk_demographics_race_code 
    FOREIGN KEY (race_id) 
    REFERENCES race_code(race_code)
    ON DELETE SET NULL, 
ADD CONSTRAINT fk_demographics_gender_code 
    FOREIGN KEY (gender_id) 
    REFERENCES gender_code(gender_code)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_demographics_ethnicity_code 
    FOREIGN KEY (ethnicity_id) 
    REFERENCES ethnicity_code(ethnicity_code)
    ON DELETE SET NULL;

ALTER TABLE receptionists
ADD CONSTRAINT fk_receptionist_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

ALTER TABLE nurses
ADD CONSTRAINT fk_nurse_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

ALTER TABLE doctor_offices
ADD CONSTRAINT fk_doctor_offices_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;



ALTER TABLE nurse_offices
ADD CONSTRAINT fk_nurse_offices_nurse
    FOREIGN KEY (nurse_id) 
    REFERENCES nurses(nurse_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_nurse_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;

ALTER TABLE appointment_notes
ADD CONSTRAINT fk_appointment_notes_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_appointment_notes_nurse
    FOREIGN KEY (created_by_nurse)
    REFERENCES nurses(nurse_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_appointment_notes_receptionist
    FOREIGN KEY (created_by_receptionist)
    REFERENCES receptionists(receptionist_id)
    ON DELETE SET NULL;

ALTER TABLE doctor_specialties
ADD CONSTRAINT fk_doctor_specialties_doctor
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_specialties_specialty
    FOREIGN KEY (specialty_code)
    REFERENCES specialties_code(specialty_code)
    ON DELETE CASCADE;

ALTER TABLE appointment_cancellations
ADD CONSTRAINT fk_cancellation_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE;

ALTER TABLE receptionist_offices
ADD CONSTRAINT fk_receptionist_offices_receptionist
    FOREIGN KEY (receptionist_id) 
    REFERENCES receptionists(receptionist_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_receptionist_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;



ALTER TABLE doctors
ADD CONSTRAINT fk_valid_employee_no_doctor
    FOREIGN KEY (doctor_employee_id)
    REFERENCES valid_employees(employee_no)
    ON DELETE CASCADE;

ALTER TABLE nurses
ADD CONSTRAINT fk_valid_employee_no_nurse
    FOREIGN KEY (nurse_employee_id)
    REFERENCES valid_employees(employee_no)
    ON DELETE CASCADE;

ALTER TABLE receptionists
ADD CONSTRAINT fk_valid_employee_no_receptionist
    FOREIGN KEY (receptionist_employee_id)
    REFERENCES valid_employees(employee_no)
    ON DELETE CASCADE;


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



