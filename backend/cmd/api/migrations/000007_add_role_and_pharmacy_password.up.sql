-- Add role column to users table
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
CREATE INDEX idx_users_role ON users(role);

-- Add password_hash column to pharmacies table for pharmacy authentication
ALTER TABLE pharmacies ADD COLUMN password_hash VARCHAR(255);

-- Create payments table for tracking Paystack transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    reference VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(15,2) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    paystack_reference VARCHAR(100),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_payments_wallet_id ON payments(wallet_id);
CREATE INDEX idx_payments_status ON payments(status);
