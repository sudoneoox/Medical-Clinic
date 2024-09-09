CREATE TABLE IF NOT EXISTS patient (
    patient_id SERIAL PRIMARY KEY,
    name name,
    dob DATE,
    ethnicities VARCHAR(50) [],
    insurances insurance [],
    address address,
    emergency_contacts emergency_contact [],
    -- (doctor id, specialty, license number)
    primary_doctor doctor_for_patient,
    -- {doctorID(specialty, licenseNumber)}
    specialized_doctors doctor_for_patient [],
) INHERITS (users);