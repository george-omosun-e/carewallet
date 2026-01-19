-- Drop payments table
DROP TABLE IF EXISTS payments;

-- Remove password_hash from pharmacies
ALTER TABLE pharmacies DROP COLUMN IF EXISTS password_hash;

-- Remove role from users
DROP INDEX IF EXISTS idx_users_role;
ALTER TABLE users DROP COLUMN IF EXISTS role;
