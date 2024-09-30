-- do constraints here with delimeters

-- in appointment notes table
 -- THIS IS AN IMPORTANT CONSTRAINT NEED TO FIND A WAY 
    -- TO DO IT IN MYSQL
    -- CONSTRAINT check_creator_type  -- not supported need trigger
    --     CHECK (
    --         (created_by_nurse IS NOT NULL AND created_by_receptionist IS NULL) OR
    --         (created_by_nurse IS NULL AND created_by_receptionist IS NOT NULL)
    --     )

-- billing table constraints
 --   CONSTRAINT check_amount_due CHECK (amount_due >= 0),
 --   CONSTRAINT check_amount_paid CHECK (amount_paid >= 0),