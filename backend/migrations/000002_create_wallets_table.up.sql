CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    beneficiary_id UUID REFERENCES users(id) ON DELETE SET NULL,
    wallet_name VARCHAR(255) NOT NULL,
    description TEXT,
    photo_url VARCHAR(500),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    funding_goal DECIMAL(15, 2),
    shareable_code VARCHAR(8) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wallets_creator_id ON wallets(creator_id);
CREATE INDEX idx_wallets_beneficiary_id ON wallets(beneficiary_id);
CREATE INDEX idx_wallets_shareable_code ON wallets(shareable_code);
CREATE INDEX idx_wallets_status ON wallets(status);
