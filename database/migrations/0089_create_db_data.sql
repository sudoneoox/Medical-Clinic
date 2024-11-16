CALL populate_test_data(
    10,  -- doctors
    10,  -- nurses
    10,   -- receptionists
    60, -- patients
    1,   -- admins
    4    -- appointments per patient
);

CALL populate_all_doctors_availability();

