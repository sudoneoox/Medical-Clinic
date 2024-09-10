-- TEMPORARY SCRIPT TO DROP ALL TABLES, TYPES, SEQUENCES, AND INDEXES WHILE TABLES AND TYPES ARE BEING REFACTORED AND NOT PERMENANT
-- Drop all tables
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS billing CASCADE;
DROP TABLE IF EXISTS insurances CASCADE;
DROP TABLE IF EXISTS prescription CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS specialist_approvals CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_offices CASCADE;
DROP TABLE IF EXISTS office CASCADE;
DROP TABLE IF EXISTS doctor CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop types
DROP TYPE IF EXISTS specialist_request_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS billing_status CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS medication CASCADE;
DROP TYPE IF EXISTS insurance CASCADE;
DROP TYPE IF EXISTS emergency_contact CASCADE;
DROP TYPE IF EXISTS address CASCADE;
DROP TYPE IF EXISTS phone_num CASCADE;

-- Drop sequences
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = current_schema()) 
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequencename) || ' CASCADE';
    END LOOP;
END $$;

-- Drop indexes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT indexname FROM pg_indexes WHERE schemaname = current_schema()) 
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(r.indexname) || ' CASCADE';
    END LOOP;
END $$;