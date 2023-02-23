CREATE TABLE merchants (
  id SERIAL PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  is_active BOOLEAN DEFAULT false,
  recorded_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
