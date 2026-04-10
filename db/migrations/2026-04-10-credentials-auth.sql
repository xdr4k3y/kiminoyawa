-- Add credentials auth support for local sign up / sign in.

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS password_hash TEXT;
