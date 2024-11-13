


DELIMITER //

-- Helper function to generate random phone numbers
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


-- generate a random date within past three months
CREATE FUNCTION random_past_date()
RETURNS TIMESTAMP
DETERMINISTIC
BEGIN
    RETURN DATE_SUB(CURRENT_TIMESTAMP, INTERVAL FLOOR(RAND() * 90) DAY);
END //

-- generate random future date within next 3 months
CREATE FUNCTION random_future_date()
RETURNS TIMESTAMP
DETERMINISTIC
BEGIN
    RETURN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (30 + FLOOR(RAND() * 60)) DAY);
END //

-- Helper function to generate random date between two dates
CREATE FUNCTION random_date(start_date DATE, end_date DATE)
RETURNS DATE
DETERMINISTIC
BEGIN
    RETURN DATE_ADD(start_date, INTERVAL FLOOR(RAND() * DATEDIFF(end_date, start_date)) DAY);
END //

-- Helper function to generate random time between two times
CREATE FUNCTION random_time(start_time TIME, end_time TIME)
RETURNS TIME
DETERMINISTIC
BEGIN
    RETURN ADDTIME(start_time, SEC_TO_TIME(FLOOR(RAND() * TIME_TO_SEC(TIMEDIFF(end_time, start_time)))));
END //

-- Create demographics 
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

-- Create user function
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

-- Create patient function
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

-- Create doctor function
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

-- Create nurse function
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

-- Create receptionist function
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

-- Create Admin function 
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


-- Create appointment function
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

-- Create medical record function
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

-- Create billing function
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
    DECLARE created_date TIMESTAMP;
    DECLARE due_date TIMESTAMP;
    
        SET amount = CASE 
        WHEN RAND() < 0.3 THEN FLOOR(50 + RAND() * 100) -- Copay range ($50-150)
        WHEN RAND() < 0.6 THEN FLOOR(200 + RAND() * 300) -- Standard visit ($200-500)
        ELSE FLOOR(500 + RAND() * 1500) -- Complex visit or procedure ($500-2000)
    END + 0.00;
    
    -- Determine payment status based on actual amounts
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

-- Main procedure to populate all tables
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
      
    -- temp fnames
    DECLARE first_names VARCHAR(1000) DEFAULT 'James,John,Robert,Michael,William,David,Richard,Joseph,Thomas,Charles,Christopher,Daniel,Matthew,Anthony,Donald,Mark,Paul,Steven,Andrew,Kenneth,Emma,Olivia,Ava,Isabella,Sophia,Charlotte,Mia,Amelia,Harper,Evelyn,Abigail,Emily,Elizabeth,Sofia,Madison,Avery,Ella,Scarlett,Victoria,Grace';
    -- temp lnames
    DECLARE last_names VARCHAR(1000) DEFAULT 'Smith,Johnson,Williams,Brown,Jones,Garcia,Miller,Davis,Rodriguez,Martinez,Hernandez,Lopez,Gonzalez,Wilson,Anderson,Thomas,Taylor,Moore,Jackson,Martin,Lee,Perez,Thompson,White,Harris,Sanchez,Clark,Ramirez,Lewis,Robinson,Walker,Young,Allen,King,Wright,Scott,Torres,Nguyen,Hill,Flores,Green,Adams,Nelson,Baker,Hall,Rivera,Campbell,Mitchell,Carter,Roberts';
    
    -- Create temporary tables for names
    CREATE TEMPORARY TABLE temp_first_names (name VARCHAR(50));
    CREATE TEMPORARY TABLE temp_last_names (name VARCHAR(50));


    -- Populate temporary name tables
    SET @sql = CONCAT("INSERT INTO temp_first_names VALUES ('", REPLACE(first_names, ",", "'),('"), "')");
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SET @sql = CONCAT("INSERT INTO temp_last_names VALUES ('", REPLACE(last_names, ",", "'),('"), "')");
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;



    -- Create offices if they don't exist
    INSERT IGNORE INTO office (office_name, office_address, office_phone, office_email) VALUES
    ('Main Clinic', '123 Medical Ave', generate_phone(), 'main@clinic.com'),
    ('North Branch', '456 Health St', generate_phone(), 'north@clinic.com'),
    ('South Branch', '789 Care Rd', generate_phone(), 'south@clinic.com');


    -- create admins
    SET i = 0;
    WHILE i < num_admins DO
        -- Create demographics
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (30 + FLOOR(RAND() * 20)) YEAR));
        
        -- Create user
        SET curr_user_id = create_user(
            CONCAT('admin', i),
            'abc',
            CONCAT('admin', i, '@clinic.com'),
            generate_phone(),
            'ADMIN',
            curr_demo_id
        );
        
        -- Create valid employee number
        SET curr_employee_id = 1600 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'ADMIN');
        
        SELECT name INTO @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name INTO @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        
        -- Create admin
        SET @admin_id = create_admin(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname
        );
        
        SET i = i + 1;
    END WHILE;   

    -- Create doctors
    SET i = 0;
    WHILE i < num_doctors DO
        -- Create demographics
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (30 + FLOOR(RAND() * 30)) YEAR));
        
        -- Create user
        SET curr_user_id = create_user(
            CONCAT('doc', i),
            'abc',
            CONCAT('doctor', i, '@clinic.com'),
            generate_phone(),
            'DOCTOR',
            curr_demo_id
        );
        
        -- Create valid employee number
        SET curr_employee_id = 1200 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'DOCTOR');
        SELECT name into @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name into @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        -- Create doctor
        SET curr_doctor_id = create_doctor(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname,
            FLOOR(5 + RAND() * 25)
        );
        
        -- Assign specialties
        INSERT INTO doctor_specialties (doctor_id, specialty_code)
        VALUES (curr_doctor_id, 1 + FLOOR(RAND() * 15));
        
        -- Assign to offices
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

    -- Create nurses
    SET i = 0;
    WHILE i < num_nurses DO
        -- Create demographics
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (25 + FLOOR(RAND() * 30)) YEAR));
        
        -- Create user
        SET curr_user_id = create_user(
            CONCAT('nurse', i),
            'abc',
            CONCAT('nurse', i, '@clinic.com'),
            generate_phone(),
            'NURSE',
            curr_demo_id
        );
        
        -- Create valid employee number
        SET curr_employee_id = 1400 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'NURSE');
        SELECT name into @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name into @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;

        -- Create nurse
        SET curr_nurse_id = create_nurse(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname
        );
        
        -- Assign to offices
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

    -- Create receptionists
    SET i = 0;
    WHILE i < num_receptionists DO
        -- Create demographics
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (20 + FLOOR(RAND() * 40)) YEAR));
        
        -- Create user
        SET curr_user_id = create_user(
            CONCAT('receptionist', i),
            'abc',
            CONCAT('receptionist', i, '@clinic.com'),
            generate_phone(),
            'RECEPTIONIST',
            curr_demo_id
        );
        
        -- Create valid employee number
        SET curr_employee_id = 1000 + i;
        INSERT INTO valid_employees (employee_no, employee_role) VALUES (curr_employee_id, 'RECEPTIONIST');
        SELECT name into @random_fname FROM temp_first_names ORDER BY RAND() LIMIT 1;
        SELECT name into @random_lname FROM temp_last_names ORDER BY RAND() LIMIT 1;
        -- Create receptionist
        SET curr_receptionist_id = create_receptionist(
            curr_user_id,
            curr_employee_id,
            @random_fname,
            @random_lname
        );
        
        -- Assign to offices
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

    -- Create patients and their appointments
    SET i = 0;
    WHILE i < num_patients DO
        -- Create demographics
        SET curr_demo_id = create_demographics(DATE_SUB(CURRENT_DATE, INTERVAL (18 + FLOOR(RAND() * 60)) YEAR));
        
        -- Create user
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
        -- Create patient
        SET curr_patient_id = create_patient(
            curr_user_id,
            @random_fname,
            @random_lname
        );

                
        -- Create appointments for this patient
        SET j = 0;
        WHILE j < num_appointments_per_patient DO
            -- Get random doctor, nurse, receptionist, and office
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
            
            -- Create appointment
            SET curr_appointment_id = create_appointment(
                curr_patient_id,
                @doc_id,
                @off_id,
                DATE_ADD(CURRENT_DATE, INTERVAL (1 + FLOOR(RAND() * 60)) DAY),
                @recep_id,
                @nurse_id
            );
            
            -- Create medical record
            SET @record_id = create_medical_record(
                curr_patient_id,
                @doc_id,
                curr_appointment_id
            );
            
            -- Create billing
            SET @billing_id = create_billing(
                curr_patient_id,
                curr_appointment_id,
                @recep_id
            );
            
            -- Create insurance record (70% chance)
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
            
            -- Create prescription (100% chance)
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
            
            -- Create test results (30% chance)
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
            
            -- Create allergies (20% chance)
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
            
            -- Create appointment notes (50% chance)
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
        
        -- Create patient-doctor relationships
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
    
    -- Create some cancelled appointments (20% of total)
    UPDATE appointments 
    SET status = 'CANCELLED'
    WHERE RAND() < 0.2;
    
    -- Create cancellation records for cancelled appointments
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
    
    -- Create some completed appointments (30% of non-cancelled)
    UPDATE appointments 
    SET status = 'COMPLETED'
    WHERE status = 'CONFIRMED' AND RAND() < 0.3;
    
    -- Create some no-shows (10% of remaining confirmed)
    UPDATE appointments 
    SET status = 'NO SHOW'
    WHERE status = 'CONFIRMED' AND RAND() < 0.1;
    
END //

DELIMITER ;


-- recursive function to generate doctor availability
DELIMITER //
-- singular doctor availability
CREATE PROCEDURE populate_doctor_availability(
    IN p_doctor_id INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_office_id INT;
    DECLARE curr_day VARCHAR(10);
    DECLARE curr_slot_id INT;
    
    -- Cursor for doctor's offices and their working days
    DECLARE office_cursor CURSOR FOR 
        SELECT DISTINCT do.office_id, do.day_of_week
        FROM doctor_offices do
        WHERE do.doctor_id = p_doctor_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- For each office and day combination
    OPEN office_cursor;
    
    read_loop: LOOP
        FETCH office_cursor INTO curr_office_id, curr_day;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Get available slots between shift start and end
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

-- utilize the previous function to make multiple

CREATE PROCEDURE populate_all_doctors_availability()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE curr_doctor_id INT;
    
    -- Cursor for all doctors
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

