-- user table relations I dont think it has any but id have to check?
ALTER TABLE users
ADD CONSTRAINT fk_user_demographics_id
    FOREIGN KEY (demographics_id)
    REFERENCES demographics(demographics_id)
    ON DELETE CASCADE;

-- Doctor table relations
ALTER TABLE doctors
ADD CONSTRAINT fk_doctor_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Patient table relations
ALTER TABLE patients
ADD CONSTRAINT fk_patient_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Patient_Doctor junction table relations
ALTER TABLE patient_doctor_junction
ADD CONSTRAINT fk_patient_doctor_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_patient_doctor_doctor
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE;

-- Specialist approvals table relations
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

-- Appointments table relations
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


-- Appointmnent Reminder relations
ALTER TABLE appointment_reminders
ADD CONSTRAINT fk_appointment_reminder_appointment_id
    FOREIGN KEY(appointment_id)
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE;


-- Billing table relations
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
    REFERENCES receptionists(receptionist_id);

-- Insurances table relations
ALTER TABLE insurances
ADD CONSTRAINT fk_insurance_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE;

-- Medical records table relations
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

-- prescription table relations
ALTER TABLE prescription
ADD CONSTRAINT fk_prescription_medical_record_id
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE;

-- test results table relations
ALTER TABLE test_results
ADD CONSTRAINT fk_test_results_medical_record_id
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_test_results_performed_by_id
    FOREIGN KEY (test_performed_by)
    REFERENCES nurses(nurse_id)
    ON DELETE CASCADE;

-- Allergens table relations
ALTER TABLE detailed_allergies
    ADD CONSTRAINT fk_detailed_allergens_record
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE;

-- Notes table relations
ALTER TABLE medical_record_notes
    ADD CONSTRAINT fk_notes_medical_record
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE;

-- Demographics table relations
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

-- Receptionist table relations
ALTER TABLE receptionists
ADD CONSTRAINT fk_receptionist_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Nurse table relations
ALTER TABLE nurses
ADD CONSTRAINT fk_nurse_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Doctor-office junction table relations
ALTER TABLE doctor_offices
ADD CONSTRAINT fk_doctor_offices_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;



-- Nurse-Office junction table relations
ALTER TABLE nurse_offices
ADD CONSTRAINT fk_nurse_offices_nurse
    FOREIGN KEY (nurse_id) 
    REFERENCES nurses(nurse_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_nurse_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;

-- Appointment_notes table relations
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

-- Doctor-Specialties junction table relations
ALTER TABLE doctor_specialties
ADD CONSTRAINT fk_doctor_specialties_doctor
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_specialties_specialty
    FOREIGN KEY (specialty_code)
    REFERENCES specialties_code(specialty_code)
    ON DELETE CASCADE;

-- Appointment cancellations table relations
ALTER TABLE appointment_cancellations
ADD CONSTRAINT fk_cancellation_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE;

-- Receptionist_Office junction table relations
ALTER TABLE receptionist_offices
ADD CONSTRAINT fk_receptionist_offices_receptionist
    FOREIGN KEY (receptionist_id) 
    REFERENCES receptionists(receptionist_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_receptionist_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;



-- valid nos
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

-- admins 
ALTER TABLE admins
ADD CONSTRAINT fk_admin_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_valid_employee_no_admin
    FOREIGN KEY (admin_employee_id)
    REFERENCES valid_employees(employee_no)
    ON DELETE CASCADE;


-- notifs
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
