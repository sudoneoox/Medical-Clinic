SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
SET FOREIGN_KEY_CHECKS = 1;
;
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(50) UNIQUE NOT NULL,
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
;
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doctor_employee_id INTEGER NOT NULL,
    doctor_fname VARCHAR(50) NOT NULL,
    doctor_lname VARCHAR(50) NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    years_of_experience TINYINT NOT NULL,
    UNIQUE(doctor_employee_id),
    UNIQUE(user_id)
); 
;
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    patient_fname VARCHAR(50) NOT NULL,
    patient_lname VARCHAR(50) NOT NULL,
    emergency_contacts JSON,
    UNIQUE(user_id)
);
;
CREATE TABLE IF NOT EXISTS patient_doctor_junction (
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    is_primary TINYINT DEFAULT 0,
    PRIMARY KEY (patient_id, doctor_id)
);
;
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    specialist_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    patient_id INTEGER NOT NULL,
    reffered_doctor_id INTEGER NOT NULL,
    specialist_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    appointment_requested_datetime TIMESTAMP NOT NULL,
    appointment_id INTEGER NOT NULL
);
;
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
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    is_primary_office TINYINT DEFAULT 0,
    effective_start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_end_date TIMESTAMP,
    schedule_type ENUM('REGULAR', 'TEMPORARY', 'ON_CALL') DEFAULT 'REGULAR',
    default_appointment_duration TIME DEFAULT '00:30:00',
    PRIMARY KEY (doctor_id, office_id, day_of_week)
);
;
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
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW', 'PENDING', 'PENDING_DOCTOR_APPROVAL') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
;
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
;
CREATE TABLE IF NOT EXISTS insurances (
    insurance_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    insurance_info JSON,
    is_active TINYINT DEFAULT (1),
    UNIQUE(insurance_id)
);
;
CREATE TABLE IF NOT EXISTS medical_records (
    record_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnosis VARCHAR(100),
    is_deleted TINYINT DEFAULT (0),
    deleted_at TIMESTAMP NULL,
    prescription_id INTEGER NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    UNIQUE(record_id)
);
;
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INTEGER NOT NULL,
    medication_name VARCHAR(50) NOT NULL,
    dosage VARCHAR(20) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    duration VARCHAR(50) NOT NULL,  -- MySQL doesn't have an INTERVAL type
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSON,
    is_deleted TINYINT DEFAULT 0,
    UNIQUE(prescription_id)
);
;
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
;
CREATE TABLE IF NOT EXISTS specialties_code (
    specialty_code TINYINT NOT NULL PRIMARY KEY,
    specialty_name VARCHAR(30) NOT NULL,
    specialty_desc VARCHAR(500),
    UNIQUE(specialty_code),
    UNIQUE(specialty_name)
);
;
CREATE TABLE IF NOT EXISTS receptionists (
    receptionist_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    receptionist_employee_id INTEGER NOT NULL,
    receptionist_fname VARCHAR(50) NOT NULL,
    receptionist_lname VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL, -- fk
    UNIQUE(receptionist_id),
    UNIQUE(user_id)
);
;
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
;
CREATE TABLE IF NOT EXISTS nurse_offices (
    nurse_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    is_primary_office TINYINT DEFAULT 0,
    effective_start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_end_date TIMESTAMP,
    schedule_type ENUM('REGULAR', 'TEMPORARY', 'ON_CALL') DEFAULT 'REGULAR',
    PRIMARY KEY (nurse_id, office_id, day_of_week)
);
;
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_nurse INTEGER,
    created_by_receptionist INTEGER,
    UNIQUE(note_id)
);
;
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INTEGER NOT NULL,
    specialty_code TINYINT NOT NULL,
    PRIMARY KEY (doctor_id, specialty_code)
);
;
CREATE TABLE IF NOT EXISTS appointment_cancellations (
    cancellation_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    canceled_reason TEXT,
    canceled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cancellation_id),
    UNIQUE(appointment_id)
);
;
CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    is_primary_office TINYINT DEFAULT 0,
    effective_start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_end_date TIMESTAMP,
    schedule_type ENUM('REGULAR', 'TEMPORARY', 'ON_CALL') DEFAULT 'REGULAR',
    PRIMARY KEY (receptionist_id, office_id, day_of_week)
);
;
CREATE TABLE IF NOT EXISTS test_results (
    test_results_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    test_type ENUM('BLOOD', 'XRAY', 'URINE'),
    test_name VARCHAR(30),
    test_conducted_date DATE,
    test_result JSON,
    test_units VARCHAR(10),
    test_interpretation ENUM("BELOW", "NORMAL", "ABOVE"),
    test_status ENUM("PENDING", "COMPLETED"),
    test_performed_by INTEGER NOT NULL,
    medical_record_id INTEGER NOT NULL,
    UNIQUE(test_results_id)
);
;
CREATE TABLE IF NOT EXISTS appointment_reminders (
    reminder_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    reminder_status ENUM('Pending', 'Sent', 'Failed') NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    sent_time TIMESTAMP NOT NULL
);
;
CREATE TABLE IF NOT EXISTS detailed_allergies (
    allergy_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    medical_record_id INTEGER NOT NULL,
    allergy_type ENUM('FOOD', 'MEDICATION', 'ENVIRONMENTAL') NOT NULL,
    allergen VARCHAR(100) NOT NULL,
    reaction TEXT,
    severity ENUM('MILD', 'MODERATE', 'SEVERE') NOT NULL,
    onset_date DATE
);
;
CREATE TABLE IF NOT EXISTS appointment_cancellations (
    cancellation_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    canceled_reason TEXT,
    canceled_at DATETIME DEFAULT CURRENT_TIMESTAMP-- ,
);
;
CREATE TABLE IF NOT EXISTS valid_employees (
  employee_no INT NOT NULL UNIQUE PRIMARY KEY,
  employee_role ENUM('DOCTOR', 'RECEPTIONIST', 'NURSE', 'ADMIN') NOT NULL
);
;
CREATE TABLE IF NOT EXISTS medical_record_notes (
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
;
CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    admin_employee_id INTEGER NOT NULL,
    admin_fname VARCHAR(50) NOT NULL,
    admin_lname VARCHAR(50) NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    can_manage_users TINYINT DEFAULT 1,
    can_manage_billing TINYINT DEFAULT 1,
    can_manage_appointments TINYINT DEFAULT 1,
    can_view_reports TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_access TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(admin_id),
    UNIQUE(admin_employee_id)
);
;
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    notification_type ENUM(
        'APPOINTMENT_REMINDER',
        'TEST_RESULTS',
        'PRESCRIPTION_READY',
        'BILLING_REMINDER',
        'MESSAGE',
        'EMERGENCY_ALERT',
        'SCHEDULE_CHANGE',
        'INSURANCE_UPDATE',
        'DOCUMENT_READY',
        'GENERAL'
    ) NOT NULL,
    notification_title VARCHAR(100) NOT NULL,
    notification_content TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    is_read TINYINT DEFAULT 0,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    metadata JSON,
    UNIQUE(notification_id)
);
;
CREATE TABLE IF NOT EXISTS time_slots (
    slot_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE(start_time, end_time)
);
INSERT INTO time_slots (start_time, end_time) 
VALUES 
    ('09:00:00', '09:30:00'),
    ('09:30:00', '10:00:00'),
    ('10:00:00', '10:30:00'),
    ('10:30:00', '11:00:00'),
    ('11:00:00', '11:30:00'),
    ('11:30:00', '12:00:00'),
    ('12:00:00', '12:30:00'),
    ('12:30:00', '13:00:00'),
    ('13:00:00', '13:30:00'),
    ('13:30:00', '14:00:00'),
    ('14:00:00', '14:30:00'),
    ('14:30:00', '15:00:00'),
    ('15:00:00', '15:30:00'),
    ('15:30:00', '16:00:00'),
    ('16:00:00', '16:30:00'),
    ('16:30:00', '17:00:00');
;
CREATE TABLE IF NOT EXISTS doctor_availability (
    availability_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    slot_id INTEGER NOT NULL,
    is_available TINYINT DEFAULT 1,
    recurrence_type ENUM('WEEKLY', 'ONE_TIME') DEFAULT 'WEEKLY',
    specific_date DATE NULL, -- Only used when recurrence_type is ONE_TIME
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_availability (doctor_id, office_id, day_of_week, slot_id, specific_date)
);
;
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
;
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
;
DELIMITER //
CREATE FUNCTION generate_phone() 
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    RETURN CONCAT(
        FLOOR(RAND() * 900 + 100),
        '-',
        FLOOR(RAND() * 900 + 100),
        '-',
        FLOOR(RAND() * 9000 + 1000)
    );
END //
CREATE FUNCTION random_date(start_date DATE, end_date DATE)
RETURNS DATE
DETERMINISTIC
BEGIN
    RETURN DATE_ADD(start_date, INTERVAL FLOOR(RAND() * DATEDIFF(end_date, start_date)) DAY);
END //
CREATE FUNCTION random_time(start_time TIME, end_time TIME)
RETURNS TIME
DETERMINISTIC
BEGIN
    RETURN ADDTIME(start_time, SEC_TO_TIME(FLOOR(RAND() * TIME_TO_SEC(TIMEDIFF(end_time, start_time)))));
END //
CREATE FUNCTION create_demographics(
    p_dob DATE
) RETURNS INT
BEGIN
    DECLARE new_demo_id INT;
    INSERT INTO demographics (
        ethnicity_id,
        race_id,
        gender_id,
        dob
    ) VALUES (
        1 + FLOOR(RAND() * 3),  -- Random ethnicity 1-3
        1 + FLOOR(RAND() * 7),  -- Random race 1-7
        1 + FLOOR(RAND() * 5),  -- Random gender 1-5
        p_dob
    );
    SET new_demo_id = LAST_INSERT_ID();
    RETURN new_demo_id;
END //
CREATE FUNCTION create_user(
    p_username VARCHAR(50),
    p_password VARCHAR(200),
    p_email VARCHAR(50),
    p_phone VARCHAR(20),
    p_role ENUM('ADMIN', 'PATIENT', 'DOCTOR', 'RECEPTIONIST', 'NURSE'),
    p_demographics_id INT
) RETURNS INT
BEGIN
    DECLARE new_user_id INT;
    INSERT INTO users (
        user_username, 
        user_password, 
        user_email, 
        user_phone, 
        user_role, 
        demographics_id
    ) VALUES (
        p_username,
        p_password,
        p_email,
        p_phone,
        p_role,
        p_demographics_id
    );
    SET new_user_id = LAST_INSERT_ID();
    RETURN new_user_id;
END //
CREATE FUNCTION create_patient(
    p_user_id INT,
    p_fname VARCHAR(50),
    p_lname VARCHAR(50)
) RETURNS INT
BEGIN
    DECLARE new_patient_id INT;
    INSERT INTO patients (
        user_id,
        patient_fname,
        patient_lname,
        emergency_contacts
    ) VALUES (
        p_user_id,
        p_fname,
        p_lname,
        JSON_OBJECT(
            'name', CONCAT('Emergency Contact for ', p_fname),
            'relationship', ELT(FLOOR(1 + RAND() * 4), 'Spouse', 'Parent', 'Sibling', 'Child'),
            'phone', generate_phone()
        )
    );
    SET new_patient_id = LAST_INSERT_ID();
    RETURN new_patient_id;
END //
CREATE FUNCTION create_doctor(
    p_user_id INT,
    p_employee_id INT,
    p_fname VARCHAR(50),
    p_lname VARCHAR(50),
    p_experience INT
) RETURNS INT
BEGIN
    DECLARE new_doctor_id INT;
    INSERT INTO doctors (
        doctor_employee_id,
        doctor_fname,
        doctor_lname,
        user_id,
        years_of_experience
    ) VALUES (
        p_employee_id,
        p_fname,
        p_lname,
        p_user_id,
        p_experience
    );
    SET new_doctor_id = LAST_INSERT_ID();
    RETURN new_doctor_id;
END //
CREATE FUNCTION create_nurse(
    p_user_id INT,
    p_employee_id INT,
    p_fname VARCHAR(50),
    p_lname VARCHAR(50)
) RETURNS INT
BEGIN
    DECLARE new_nurse_id INT;
    INSERT INTO nurses (
        nurse_employee_id,
        nurse_fname,
        nurse_lname,
        user_id,
        specialization,
        years_of_experience
    ) VALUES (
        p_employee_id,
        p_fname,
        p_lname,
        p_user_id,
        ELT(FLOOR(1 + RAND() * 5), 'Pediatrics', 'Emergency', 'ICU', 'Surgery', 'General'),
        FLOOR(1 + RAND() * 20)
    );
    SET new_nurse_id = LAST_INSERT_ID();
    RETURN new_nurse_id;
END //
CREATE FUNCTION create_receptionist(
    p_user_id INT,
    p_employee_id INT,
    p_fname VARCHAR(50),
    p_lname VARCHAR(50)
) RETURNS INT
BEGIN
    DECLARE new_receptionist_id INT;
    INSERT INTO receptionists (
        receptionist_employee_id,
        receptionist_fname,
        receptionist_lname,
        user_id
    ) VALUES (
        p_employee_id,
        p_fname,
        p_lname,
        p_user_id
    );
    SET new_receptionist_id = LAST_INSERT_ID();
    RETURN new_receptionist_id;
END //
CREATE FUNCTION create_admin(
    p_user_id INT,
    p_employee_id INT,
    p_fname VARCHAR(50),
    p_lname VARCHAR(50)
) RETURNS INT
BEGIN
    DECLARE new_admin_id INT;
    INSERT INTO admins (
        admin_employee_id,
        admin_fname,
        admin_lname,
        user_id,
        can_manage_users,
        can_manage_billing,
        can_manage_appointments,
        can_view_reports
    ) VALUES (
        p_employee_id,
        p_fname,
        p_lname,
        p_user_id,
        TRUE,  -- All permissions set to true as requested
        TRUE,
        TRUE,
        TRUE
    );
    SET new_admin_id = LAST_INSERT_ID();
    RETURN new_admin_id;
END //
CREATE FUNCTION create_appointment(
    p_patient_id INT,
    p_doctor_id INT,
    p_office_id INT,
    p_datetime DATETIME,
    p_booked_by INT,
    p_attending_nurse INT
) RETURNS INT
BEGIN
    DECLARE new_appointment_id INT;
    INSERT INTO appointments (
        patient_id,
        doctor_id,
        office_id,
        appointment_datetime,
        duration,
        booked_by,
        attending_nurse,
        reason,
        status
    ) VALUES (
        p_patient_id,
        p_doctor_id,
        p_office_id,
        p_datetime,
        ELT(FLOOR(1 + RAND() * 3), '00:30:00', '01:00:00', '01:30:00'),
        p_booked_by,
        p_attending_nurse,
        ELT(FLOOR(1 + RAND() * 5), 'Regular Checkup', 'Follow-up', 'Consultation', 'Vaccination', 'Prescription Renewal'),
        'CONFIRMED'
    );
    SET new_appointment_id = LAST_INSERT_ID();
    RETURN new_appointment_id;
END //
CREATE FUNCTION create_medical_record(
    p_patient_id INT,
    p_doctor_id INT,
    p_appointment_id INT
) RETURNS INT
BEGIN
    DECLARE new_record_id INT;
    INSERT INTO medical_records (
        diagnosis,
        patient_id,
        doctor_id,
        appointment_id
    ) VALUES (
        ELT(FLOOR(1 + RAND() * 10), 
            'Hypertension',
            'Type 2 Diabetes',
            'Upper Respiratory Infection',
            'Anxiety Disorder',
            'Lower Back Pain',
            'Allergic Rhinitis',
            'Gastroesophageal Reflux',
            'Migraine',
            'Asthma',
            'Regular Checkup - No Issues'
        ),
        p_patient_id,
        p_doctor_id,
        p_appointment_id
    );
    SET new_record_id = LAST_INSERT_ID();
    RETURN new_record_id;
END //
CREATE FUNCTION create_billing(
    p_patient_id INT,
    p_appointment_id INT,
    p_handled_by INT
) RETURNS INT
BEGIN
    DECLARE new_billing_id INT;
    DECLARE amount DECIMAL(7,2);
    DECLARE paid_amount DECIMAL(7,2);
    DECLARE payment_stat VARCHAR(20);
    SET amount = FLOOR(50 + RAND() * 450) + 0.99;
    SET paid_amount = IF(RAND() < 0.7, amount, 0); -- 70% chance of payment
    IF paid_amount = 0 THEN
        SET payment_stat = 'NOT PAID';
    ELSEIF paid_amount = amount THEN
        SET payment_stat = 'PAID';
    ELSE
        SET payment_stat = 'IN PROGRESS';
    END IF;
    INSERT INTO billing (
        patient_id,
        appointment_id,
        amount_due,
        amount_paid,
        payment_status,
        billing_due,
        handled_by
    ) VALUES (
        p_patient_id,
        p_appointment_id,
        amount,
        paid_amount,
        payment_stat,
        DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
        p_handled_by
    );
    INSERT INTO notifications (
        sender_id,
        receiver_id,
        notification_type,
        notification_title,
        notification_content,
        priority,
        metadata
    ) VALUES (
        p_handled_by, -- sender (receptionist)
        (SELECT user_id FROM patients WHERE patient_id = p_patient_id), -- receiver
        'BILLING_REMINDER',
        CONCAT('New billing statement - $', amount),
        CONCAT('A new billing statement of $', amount, ' has been generated for your recent appointment.'),
        'MEDIUM',
        JSON_OBJECT(
            'billing_id', LAST_INSERT_ID(),
            'amount', amount,
            'due_date', DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)
        )
    );
    SET new_billing_id = LAST_INSERT_ID();
    RETURN new_billing_id;
END //
CREATE PROCEDURE populate_test_data(
    IN num_doctors INT,
    IN num_nurses INT,
    IN num_receptionists INT,
    IN num_patients INT,
    IN num_admins INT,
    IN num_appointments_per_patient INT
)
BEGIN
    DECLARE i, j INT DEFAULT 0;
    DECLARE curr_doctor_id, curr_nurse_id, curr_receptionist_id, curr_patient_id, curr_appointment_id INT;
    DECLARE curr_user_id, curr_demo_id INT;
    DECLARE curr_employee_id INT;
    DECLARE first_names VARCHAR(1000) DEFAULT 'James,John,Robert,Michael,William,David,Richard,Joseph,Thomas,Charles,Christopher,Daniel,Matthew,Anthony,Donald,Mark,Paul,Steven,Andrew,Kenneth,Emma,Olivia,Ava,Isabella,Sophia,Charlotte,Mia,Amelia,Harper,Evelyn,Abigail,Emily,Elizabeth,Sofia,Madison,Avery,Ella,Scarlett,Victoria,Grace';
    DECLARE last_names VARCHAR(1000) DEFAULT 'Smith,Johnson,Williams,Brown,Jones,Garcia,Miller,Davis,Rodriguez,Martinez,Hernandez,Lopez,Gonzalez,Wilson,Anderson,Thomas,Taylor,Moore,Jackson,Martin,Lee,Perez,Thompson,White,Harris,Sanchez,Clark,Ramirez,Lewis,Robinson,Walker,Young,Allen,King,Wright,Scott,Torres,Nguyen,Hill,Flores,Green,Adams,Nelson,Baker,Hall,Rivera,Campbell,Mitchell,Carter,Roberts';
    CREATE TEMPORARY TABLE temp_first_names (name VARCHAR(50));
    CREATE TEMPORARY TABLE temp_last_names (name VARCHAR(50));
    SET @sql = CONCAT("INSERT INTO temp_first_names VALUES ('", REPLACE(first_names, ",", "'),('"), "')");
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SET @sql = CONCAT("INSERT INTO temp_last_names VALUES ('", REPLACE(last_names, ",", "'),('"), "')");
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    INSERT IGNORE INTO office (office_name, office_address, office_phone, office_email) VALUES
    ('Main Clinic', '123 Medical Ave', generate_phone(), 'main@clinic.com'),
    ('North Branch', '456 Health St', generate_phone(), 'north@clinic.com'),
    ('South Branch', '789 Care Rd', generate_phone(), 'south@clinic.com');
    SET i = 0;
    WHILE i < num_admins DO
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (30 + FLOOR(RAND() * 20)) YEAR));
        SET curr_user_id = create_user(
            CONCAT('admin', i),
            'abc',
            CONCAT('admin', i, '@clinic.com'),
            generate_phone(),
            'ADMIN',
            curr_demo_id
        );
        SET curr_employee_id = 1600 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'ADMIN');
        SELECT name INTO @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name INTO @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        SET @admin_id = create_admin(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname
        );
        SET i = i + 1;
    END WHILE;   
    SET i = 0;
    WHILE i < num_doctors DO
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (30 + FLOOR(RAND() * 30)) YEAR));
        SET curr_user_id = create_user(
            CONCAT('doc', i),
            'abc',
            CONCAT('doctor', i, '@clinic.com'),
            generate_phone(),
            'DOCTOR',
            curr_demo_id
        );
        SET curr_employee_id = 1200 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'DOCTOR');
        SELECT name into @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name into @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        SET curr_doctor_id = create_doctor(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname,
            FLOOR(5 + RAND() * 25)
        );
        INSERT INTO doctor_specialties (doctor_id, specialty_code)
        VALUES (curr_doctor_id, 1 + FLOOR(RAND() * 15));
        INSERT INTO doctor_offices (
    doctor_id, 
    office_id,
    day_of_week,
    shift_start,
    shift_end,
    is_primary_office,
    effective_start_date,
    schedule_type
)
SELECT 
    curr_doctor_id,
    o.office_id,
    d.day,
    ADDTIME('08:00:00', SEC_TO_TIME(FLOOR(RAND() * 3600))), -- Random start between 8 AM and 9 AM
    ADDTIME('17:00:00', SEC_TO_TIME(FLOOR(RAND() * 7200))), -- Random end between 5 PM and 7 PM
    IF(o.office_id = (SELECT MIN(office_id) FROM office), TRUE, FALSE), -- Primary office for first office
    CURRENT_DATE,
    'REGULAR'
FROM (SELECT DISTINCT office_id FROM office ORDER BY RAND() LIMIT 1) o
CROSS JOIN (
    SELECT 'MONDAY' as day UNION ALL
    SELECT 'TUESDAY' UNION ALL
    SELECT 'WEDNESDAY' UNION ALL
    SELECT 'THURSDAY' UNION ALL
    SELECT 'FRIDAY'
) d;
        SET i = i + 1;
    END WHILE;
    SET i = 0;
    WHILE i < num_nurses DO
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (25 + FLOOR(RAND() * 30)) YEAR));
        SET curr_user_id = create_user(
            CONCAT('nurse', i),
            'abc',
            CONCAT('nurse', i, '@clinic.com'),
            generate_phone(),
            'NURSE',
            curr_demo_id
        );
        SET curr_employee_id = 1400 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'NURSE');
        SELECT name into @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name into @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        SET curr_nurse_id = create_nurse(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname
        );
       INSERT INTO nurse_offices (
    nurse_id, 
    office_id,
    day_of_week,
    shift_start,
    shift_end,
    is_primary_office,
    effective_start_date,
    schedule_type
)
SELECT 
    curr_nurse_id,
    o.office_id,
    d.day,
    ADDTIME('08:00:00', SEC_TO_TIME(FLOOR(RAND() * 3600))), -- Random start between 8 AM and 9 AM
    ADDTIME('17:00:00', SEC_TO_TIME(FLOOR(RAND() * 7200))), -- Random end between 5 PM and 7 PM
    IF(o.office_id = (SELECT MIN(office_id) FROM office), TRUE, FALSE), -- Primary office for first office
    CURRENT_DATE,
    'REGULAR'
FROM (SELECT DISTINCT office_id FROM office ORDER BY RAND() LIMIT 1) o
CROSS JOIN (
    SELECT 'MONDAY' as day UNION ALL
    SELECT 'TUESDAY' UNION ALL
    SELECT 'WEDNESDAY' UNION ALL
    SELECT 'THURSDAY' UNION ALL
    SELECT 'FRIDAY'
) d;
        SET i = i + 1;
    END WHILE;
    SET i = 0;
    WHILE i < num_receptionists DO
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (20 + FLOOR(RAND() * 40)) YEAR));
        SET curr_user_id = create_user(
            CONCAT('receptionist', i),
            'abc',
            CONCAT('receptionist', i, '@clinic.com'),
            generate_phone(),
            'RECEPTIONIST',
            curr_demo_id
        );
        SET curr_employee_id = 1000 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'RECEPTIONIST');
        SELECT name into @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name into @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        SET curr_receptionist_id = create_receptionist(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname
        );
        INSERT INTO receptionist_offices (
    receptionist_id, 
    office_id,
    day_of_week,
    shift_start,
    shift_end,
    is_primary_office,
    effective_start_date,
    schedule_type
)
SELECT 
    curr_receptionist_id,
    o.office_id,
    d.day,
    ADDTIME('08:00:00', SEC_TO_TIME(FLOOR(RAND() * 3600))), -- Random start between 8 AM and 9 AM
    ADDTIME('17:00:00', SEC_TO_TIME(FLOOR(RAND() * 7200))), -- Random end between 5 PM and 7 PM
    IF(o.office_id = (SELECT MIN(office_id) FROM office), TRUE, FALSE), -- Primary office for first office
    CURRENT_DATE,
    'REGULAR'
FROM (SELECT DISTINCT office_id FROM office ORDER BY RAND() LIMIT 1) o
CROSS JOIN (
    SELECT 'MONDAY' as day UNION ALL
    SELECT 'TUESDAY' UNION ALL
    SELECT 'WEDNESDAY' UNION ALL
    SELECT 'THURSDAY' UNION ALL
    SELECT 'FRIDAY'
) d;
        SET i = i + 1;
    END WHILE;
    SET i = 0;
    WHILE i < num_patients DO
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (18 + FLOOR(RAND() * 60)) YEAR));
        SET curr_user_id = create_user(
            CONCAT('patient', i),
            'abc',
            CONCAT('patient', i, '@email.com'),
            generate_phone(),
            'PATIENT',
            curr_demo_id
        );
        SELECT name into @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name into @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        SET curr_patient_id = create_patient(
            curr_user_id,
            @random_fname,
            @random_lname
        );
        SET j = 0;
        WHILE j < num_appointments_per_patient DO
            SELECT doctor_id, office_id INTO @doc_id, @off_id 
            FROM doctor_offices 
            ORDER BY RAND() 
            LIMIT 1;
            SELECT receptionist_id INTO @recep_id 
            FROM receptionist_offices 
            WHERE office_id = @off_id 
            ORDER BY RAND() 
            LIMIT 1;
            SELECT nurse_id INTO @nurse_id 
            FROM nurse_offices 
            WHERE office_id = @off_id 
            ORDER BY RAND() 
            LIMIT 1;
            SET curr_appointment_id = create_appointment(
                curr_patient_id,
                @doc_id,
                @off_id,
                DATE_ADD(CURRENT_DATE, INTERVAL (1 + FLOOR(RAND() * 60)) DAY),
                @recep_id,
                @nurse_id
            );
            SET @record_id = create_medical_record(
                curr_patient_id,
                @doc_id,
                curr_appointment_id
            );
            SET @billing_id = create_billing(
                curr_patient_id,
                curr_appointment_id,
                @recep_id
            );
            IF RAND() < 0.7 THEN
                INSERT INTO insurances (
                    patient_id,
                    insurance_info,
                    is_active
                ) VALUES (
                    curr_patient_id,
                    JSON_OBJECT(
                        'provider', ELT(FLOOR(1 + RAND() * 5), 'Blue Cross', 'Aetna', 'UnitedHealth', 'Cigna', 'Humana'),
                        'policy_number', CONCAT('POL-', FLOOR(RAND() * 1000000)),
                        'coverage_start', DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 365) DAY), '%Y-%m-%d'),
                        'coverage_end', DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL 365 DAY), '%Y-%m-%d'),
                        'copay', FLOOR(RAND() * 50)
                    ),
                    1
                );
            END IF;
            IF RAND() < 1.0 THEN
                INSERT INTO prescription (
                    medical_record_id,
                    medication_name,
                    dosage,
                    frequency,
                    duration,
                    pharmacy_details
                ) VALUES (
                    @record_id,
                    ELT(FLOOR(1 + RAND() * 5), 'Amoxicillin', 'Lisinopril', 'Metformin', 'Omeprazole', 'Sertraline'),
                    ELT(FLOOR(1 + RAND() * 3), '500mg', '250mg', '100mg'),
                    ELT(FLOOR(1 + RAND() * 4), 'Once daily', 'Twice daily', 'Three times daily', 'As needed'),
                    ELT(FLOOR(1 + RAND() * 3), '7 days', '14 days', '30 days'),
                    JSON_OBJECT(
                        'pharmacy_name', ELT(FLOOR(1 + RAND() * 3), 'CVS', 'Walgreens', 'RiteAid'),
                        'pharmacy_phone', generate_phone(),
                        'pharmacy_address', CONCAT(FLOOR(RAND() * 1000), ' Pharmacy St')
                    )
                );
            END IF;
            IF RAND() < 0.3 THEN
                INSERT INTO test_results (
                    test_type,
                    test_name,
                    test_conducted_date,
                    test_result,
                    test_units,
                    test_interpretation,
                    test_status,
                    test_performed_by,
                    medical_record_id
                ) VALUES (
                    ELT(FLOOR(1 + RAND() * 3), 'BLOOD', 'XRAY', 'URINE'),
                    ELT(FLOOR(1 + RAND() * 3), 'Complete Blood Count', 'Chest X-Ray', 'Urinalysis'),
                    CURRENT_DATE,
                    JSON_OBJECT(
                        'value', FLOOR(RAND() * 100),
                        'reference_range', '0-100'
                    ),
                    ELT(FLOOR(1 + RAND() * 3), 'mg/dL', 'mmol/L', 'g/L'),
                    ELT(FLOOR(1 + RAND() * 3), 'BELOW', 'NORMAL', 'ABOVE'),
                    'COMPLETED',
                    @nurse_id,
                    @record_id
                );
            END IF;
            IF RAND() < 0.2 THEN
                INSERT INTO detailed_allergies (
                    medical_record_id,
                    allergy_type,
                    allergen,
                    reaction,
                    severity,
                    onset_date
                ) VALUES (
                    @record_id,
                    ELT(FLOOR(1 + RAND() * 3), 'FOOD', 'MEDICATION', 'ENVIRONMENTAL'),
                    ELT(FLOOR(1 + RAND() * 5), 'Penicillin', 'Peanuts', 'Latex', 'Pollen', 'Shellfish'),
                    ELT(FLOOR(1 + RAND() * 3), 'Rash', 'Difficulty breathing', 'Swelling'),
                    ELT(FLOOR(1 + RAND() * 3), 'MILD', 'MODERATE', 'SEVERE'),
                    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 3650) DAY)
                );
            END IF;
            IF RAND() < 0.5 THEN
                INSERT INTO appointment_notes (
                    appointment_id,
                    note_text,
                    created_by_nurse,
                    created_by_receptionist
                ) VALUES (
                    curr_appointment_id,
                    ELT(FLOOR(1 + RAND() * 3), 
                        'Patient requested evening appointments in future.',
                        'Patient prefers Dr. Smith for follow-ups.',
                        'Patient requires wheelchair access.'
                    ),
                    IF(RAND() < 0.5, @nurse_id, NULL),
                    IF(RAND() >= 0.5, @recep_id, NULL)
                );
            END IF;
            SET j = j + 1;
        END WHILE;
        INSERT INTO patient_doctor_junction (
            patient_id,
            doctor_id,
            is_primary
        )
        SELECT 
            curr_patient_id,
            doctor_id,
            IF(ROW_NUMBER() OVER () = 1, 1, 0)
        FROM doctors
        WHERE RAND() < 0.3
        LIMIT 3;
        SET i = i + 1;
    END WHILE;
    UPDATE appointments 
    SET status = 'CANCELLED'
    WHERE RAND() < 0.2;
    INSERT INTO appointment_cancellations (
        appointment_id,
        canceled_reason,
        canceled_at
    )
    SELECT 
        appointment_id,
        ELT(FLOOR(1 + RAND() * 3), 'Schedule conflict', 'Feeling better', 'Emergency came up'),
        CURRENT_TIMESTAMP
    FROM appointments
    WHERE status = 'CANCELLED';
    UPDATE appointments 
    SET status = 'COMPLETED'
    WHERE status = 'CONFIRMED' AND RAND() < 0.3;
    UPDATE appointments 
    SET status = 'NO SHOW'
    WHERE status = 'CONFIRMED' AND RAND() < 0.1;
END //
DELIMITER ;
DELIMITER //
CREATE PROCEDURE populate_doctor_availability(
    IN p_doctor_id INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_office_id INT;
    DECLARE curr_day VARCHAR(10);
    DECLARE curr_slot_id INT;
    DECLARE office_cursor CURSOR FOR 
        SELECT DISTINCT do.office_id, do.day_of_week
        FROM doctor_offices do
        WHERE do.doctor_id = p_doctor_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN office_cursor;
    read_loop: LOOP
        FETCH office_cursor INTO curr_office_id, curr_day;
        IF done THEN
            LEAVE read_loop;
        END IF;
        INSERT INTO doctor_availability (
            doctor_id, 
            office_id, 
            day_of_week, 
            slot_id, 
            is_available,
            recurrence_type
        )
        SELECT 
            p_doctor_id,
            curr_office_id,
            curr_day,
            ts.slot_id,
            1, -- is_available
            'WEEKLY' -- recurrence_type
        FROM 
            time_slots ts
        JOIN 
            doctor_offices do ON 
                do.doctor_id = p_doctor_id AND 
                do.office_id = curr_office_id AND 
                do.day_of_week = curr_day
        WHERE 
            ts.start_time >= do.shift_start AND 
            ts.end_time <= do.shift_end
        ON DUPLICATE KEY UPDATE is_available = 1;
    END LOOP;
    CLOSE office_cursor;
END //
CREATE PROCEDURE populate_all_doctors_availability()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_doctor_id INT;
    DECLARE doctor_cursor CURSOR FOR 
        SELECT doctor_id FROM doctors;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN doctor_cursor;
    read_loop: LOOP
        FETCH doctor_cursor INTO curr_doctor_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        CALL populate_doctor_availability(curr_doctor_id);
    END LOOP;
    CLOSE doctor_cursor;
END //
DELIMITER ;
;
CALL populate_test_data(
    10,  -- 10 doctors
    20,  -- 20 nurses
    5,   -- 5 receptionists
    100, -- 100 patients
    3,   -- 3 admins
    4    -- 4 appointments per patient
);
CALL populate_all_doctors_availability();
;
DELIMITER //
CREATE TRIGGER before_appointment_specialist_check
BEFORE INSERT ON appointments
FOR EACH ROW
label_name: BEGIN  -- Add a label
    DECLARE is_specialist TINYINT(1);
    DECLARE is_primary_doctor TINYINT(1);
    IF NEW.status = 'PENDING_DOCTOR_APPROVAL' THEN
        LEAVE label_name;  -- Use LEAVE instead of RETURN
    END IF;
    SELECT EXISTS (
        SELECT 1
        FROM patient_doctor_junction pdj
        WHERE pdj.patient_id = NEW.patient_id 
        AND pdj.doctor_id = NEW.doctor_id
        AND pdj.is_primary = 1
    ) INTO is_primary_doctor;
    IF is_primary_doctor = 0 THEN
        SELECT EXISTS (
            SELECT 1
            FROM doctor_specialties ds
            WHERE ds.doctor_id = NEW.doctor_id
        ) INTO is_specialist;
        IF is_specialist = 1 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'SPECIALIST_APPROVAL_REQUIRED';
        END IF;
    ELSE
        SET NEW.status = 'CONFIRMED';
    END IF;
END //
DELIMITER ;
DELIMITER //
CREATE TRIGGER check_patient_unpaid_bills
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE unpaid_count INT;
    SELECT COUNT(DISTINCT appointment_id) INTO unpaid_count
    FROM billing
    WHERE patient_id = NEW.patient_id
    AND payment_status IN ('NOT PAID', 'IN PROGRESS');
    IF unpaid_count >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'BILLING_LIMIT_REACHED';
    END IF;
END //
DELIMITER ;
DELIMITER //
CREATE TRIGGER check_duplicate_appointments
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE existing_count INT;
    SELECT COUNT(*) INTO existing_count
    FROM appointments
    WHERE doctor_id = NEW.doctor_id
    AND DATE(appointment_datetime) = DATE(NEW.appointment_datetime)
    AND TIME(appointment_datetime) = TIME(NEW.appointment_datetime)
    AND status != 'CANCELLED';
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'DUPLICATE_APPOINTMENT_TIME';
    END IF;
END//
DELIMITER ;
;
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
    OPEN day_cursor;
    day_loop: LOOP
        FETCH day_cursor INTO day_name;
        IF done THEN
            LEAVE day_loop;
        END IF;
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
;
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
CREATE INDEX idx_notifications_sender ON notifications(sender_id);
CREATE INDEX idx_notifications_receiver ON notifications(receiver_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
;
ALTER TABLE appointments
ADD CONSTRAINT chk_appointment_duration 
CHECK (TIME_TO_SEC(duration) > 0);
ALTER TABLE doctors
ADD CONSTRAINT chk_doctor_experience 
CHECK (years_of_experience >= 0 AND years_of_experience <= 70);
ALTER TABLE billing
ADD CONSTRAINT chk_billing_amounts 
CHECK (amount_due >= 0 AND amount_paid >= 0);
ALTER TABLE doctor_offices
ADD CONSTRAINT chk_doctor_shift_times
CHECK (shift_start < shift_end);
ALTER TABLE nurse_offices
ADD CONSTRAINT chk_nurse_shift_times
CHECK (shift_start < shift_end);
ALTER TABLE receptionist_offices
ADD CONSTRAINT chk_receptionist_shift_times
CHECK (shift_start < shift_end);
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
;
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
    ON DELETE CASCADE,
ADD CONSTRAINT fk_approval_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(appointment_id)
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
ALTER TABLE medical_record_notes
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
ALTER TABLE admins
ADD CONSTRAINT fk_admin_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_valid_employee_no_admin
    FOREIGN KEY (admin_employee_id)
    REFERENCES valid_employees(employee_no)
    ON DELETE CASCADE;
ALTER TABLE notifications
ADD CONSTRAINT fk_notification_sender
    FOREIGN KEY (sender_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_notification_receiver
    FOREIGN KEY (receiver_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;
ALTER TABLE doctor_availability
ADD CONSTRAINT fk_doctor_availibility_doctor
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_availibility_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_availibility_time
    FOREIGN KEY (slot_id)
    REFERENCES time_slots(slot_id)
    ON DELETE CASCADE;
;
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
;
