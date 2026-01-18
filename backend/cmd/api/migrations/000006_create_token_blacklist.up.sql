CREATE TABLE token_blacklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_jti VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_token_blacklist_jti ON token_blacklist(token_jti);
CREATE INDEX idx_token_blacklist_expires_at ON token_blacklist(expires_at);
