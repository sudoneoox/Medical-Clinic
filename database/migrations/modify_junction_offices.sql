ALTER TABLE doctor_offices 
ADD COLUMN shift_start TIME,
ADD COLUMN shift_end TIME;

-- Update NURSE_OFFICES junction table
ALTER TABLE nurse_offices 
ADD COLUMN shift_start TIME,
ADD COLUMN shift_end TIME;

-- Update RECEPTIONIST_OFFICES junction table
ALTER TABLE receptionist_offices 
ADD COLUMN shift_start TIME,
ADD COLUMN shift_end TIME;