-- data structure? for faster queries but slower inserts and updates
-- run after loading some data 
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_datetime);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX idx_notifications_receiver_id ON notifications(receiver_id);

CREATE INDEX idx_appointment_notes_appointment_id ON appointment_notes(appointment_id);
CREATE INDEX idx_appointment_notes_created_by_nurse ON appointment_notes(created_by_nurse);
CREATE INDEX idx_appointment_notes_created_by_receptionist ON appointment_notes(created_by_receptionist);