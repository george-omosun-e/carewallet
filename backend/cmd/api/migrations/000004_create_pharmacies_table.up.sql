CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    short_code VARCHAR(20) NOT NULL UNIQUE,
    registration_number VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pharmacies_short_code ON pharmacies(short_code);
CREATE INDEX idx_pharmacies_status ON pharmacies(status);

-- Add foreign key to transactions table
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_pharmacy
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE SET NULL;
