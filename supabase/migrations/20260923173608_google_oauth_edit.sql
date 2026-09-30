ALTER TABLE users_table
ALTER COLUMN password DROP NOT NULL,
ALTER COLUMN email DROP NOT NULL;

ALTER TABLE users_table 
ADD COLUMN gmail TEXT UNIQUE;

ALTER TABLE users_table ADD CONSTRAINT user_login_check
CHECK (
    gmail IS NOT NULL
    OR
    (password IS NOT NULL AND email IS NOT NULL)
);