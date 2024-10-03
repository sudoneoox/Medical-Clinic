-- Users table indexes
CREATE INDEX idx_users_role ON users(user_role);
CREATE INDEX idx_users_email ON users(user_email);

-- Doctors table indexes
CREATE INDEX idx_doctors_name ON doctors(doctor_name);

-- Patients table indexes
CREATE INDEX idx_patients_name ON patients(patient_name);

-- Appointments table indexes
CREATE INDEX idx_appointments_datetime ON appointments(appointment_datetime);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_patient_doctor ON appointments(patient_id, doctor_id);

-- Medical records table indexes
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_date ON medical_records(created_at);

-- Prescription table indexes
CREATE INDEX idx_prescription_medication ON prescription(medication_name);

-- Billing table indexes
CREATE INDEX idx_billing_patient ON billing(patient_id);
CREATE INDEX idx_billing_status ON billing(payment_status);

-- Insurances table indexes
CREATE INDEX idx_insurances_patient ON insurances(patient_id);
CREATE INDEX idx_insurances_active ON insurances(is_active);

-- Office table indexes
CREATE INDEX idx_office_name ON office(office_name);

-- Specialist approvals table indexes
CREATE INDEX idx_specialist_approvals_status ON specialist_approvals(specialist_status);
CREATE INDEX idx_specialist_approvals_patient ON specialist_approvals(patient_id);

-- Appointment reminders table indexes
CREATE INDEX idx_appointment_reminders_status ON appointment_reminders(reminder_status);
CREATE INDEX idx_appointment_reminders_scheduled ON appointment_reminders(scheduled_time);

-- Detailed allergies table indexes
CREATE INDEX idx_detailed_allergies_type ON detailed_allergies(allergy_type);
CREATE INDEX idx_detailed_allergies_allergen ON detailed_allergies(allergen);

-- Test results table indexes
CREATE INDEX idx_test_results_type ON test_results(test_type);
CREATE INDEX idx_test_results_status ON test_results(test_status);
CREATE INDEX idx_test_results_date ON test_results(test_conducted_date);

-- Demographics table indexes
CREATE INDEX idx_demographics_dob ON demographics(dob);

-- indexes for junction tables
CREATE INDEX idx_patient_doctor_junction ON patient_doctor_junction(patient_id, doctor_id);
CREATE INDEX idx_doctor_specialties ON doctor_specialties(doctor_id, specialtity_code);
CREATE INDEX idx_doctor_offices ON doctor_offices(doctor_id, office_id);
CREATE INDEX idx_nurse_offices ON nurse_offices(nurse_id, office_id);
CREATE INDEX idx_receptionist_offices ON receptionist_offices(receptionist_id, office_id);