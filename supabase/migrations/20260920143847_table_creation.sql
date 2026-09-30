CREATE TABLE users_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  password TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE
);
