CREATE INDEX idx_users_firstname ON users_table(firstname);
CREATE INDEX idx_users_surname ON users_table(surname);
CREATE INDEX idx_users ON users_table(firstname, surname);