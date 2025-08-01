-- Create the Waitlist table
CREATE TABLE "Waitlist" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    institution_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NULL,
    prefrences VARCHAR(255) NULL,
    message TEXT NULL,
    client_ip INET NULL,
    country VARCHAR(2) NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Create an index on email for faster lookups
CREATE INDEX idx_waitlist_email ON "Waitlist"(email);

-- Create an index on joined_at for sorting/querying by join date
CREATE INDEX idx_waitlist_joined_at ON "Waitlist"(joined_at);

-- Create an index on country for geographic analytics
CREATE INDEX idx_waitlist_country ON "Waitlist"(country);

-- Create an index on client_ip for IP-based analytics
CREATE INDEX idx_waitlist_client_ip ON "Waitlist"(client_ip);

-- Optional: Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW() AT TIME ZONE 'UTC';
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_waitlist_updated_at 
    BEFORE UPDATE ON "Waitlist" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();