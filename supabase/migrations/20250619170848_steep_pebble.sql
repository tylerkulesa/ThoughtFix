/*
  # Add User Profile and Thoughts Tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `first_name` (text)
      - `last_name` (text)
      - `gender` (enum: prefer_not_to_say, female, male, non_binary, other)
      - `age_range` (enum: prefer_not_to_say, 13-17, 18-24, 25-34, 35-44, 45-54, 55-64, 65+)
      - `job` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `thoughts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `original_text` (text, not null)
      - `reframed_text` (text, not null)
      - `category` (text, default 'Personal Growth')
      - `created_at` (timestamp)

    - `usage_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `date` (date, not null)
      - `usage_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
    - Create indexes for performance optimization

  3. Functions
    - Trigger to auto-create user profile on auth signup
    - Function to increment usage count
*/

-- Create gender enum
CREATE TYPE user_gender AS ENUM (
    'prefer_not_to_say',
    'female',
    'male',
    'non_binary',
    'other'
);

-- Create age range enum
CREATE TYPE user_age_range AS ENUM (
    'prefer_not_to_say',
    '13-17',
    '18-24',
    '25-34',
    '35-44',
    '45-54',
    '55-64',
    '65+'
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    first_name text,
    last_name text,
    gender user_gender DEFAULT 'prefer_not_to_say',
    age_range user_age_range DEFAULT 'prefer_not_to_say',
    job text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Create thoughts table
CREATE TABLE IF NOT EXISTS thoughts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_text text NOT NULL,
    reframed_text text NOT NULL,
    category text DEFAULT 'Personal Growth',
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

-- Create policies for thoughts table
CREATE POLICY "Users can view their own thoughts"
    ON thoughts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own thoughts"
    ON thoughts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thoughts"
    ON thoughts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thoughts"
    ON thoughts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create usage_log table
CREATE TABLE IF NOT EXISTS usage_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date date NOT NULL,
    usage_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE usage_log ENABLE ROW LEVEL SECURITY;

-- Create policies for usage_log table
CREATE POLICY "Users can view their own usage log"
    ON usage_log
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage log"
    ON usage_log
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage log"
    ON usage_log
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_created_at ON thoughts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_log_user_id ON usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_log_date ON usage_log(date DESC);
CREATE INDEX IF NOT EXISTS idx_usage_log_user_date ON usage_log(user_id, date);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO users (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count(user_uuid uuid)
RETURNS void AS $$
BEGIN
    INSERT INTO usage_log (user_id, date, usage_count)
    VALUES (user_uuid, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
        usage_count = usage_log.usage_count + 1,
        updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get weekly usage count
CREATE OR REPLACE FUNCTION get_weekly_usage_count(user_uuid uuid)
RETURNS integer AS $$
DECLARE
    week_start date;
    total_usage integer;
BEGIN
    -- Calculate start of current week (Monday)
    week_start := date_trunc('week', CURRENT_DATE);
    
    -- Sum usage for the current week
    SELECT COALESCE(SUM(usage_count), 0)
    INTO total_usage
    FROM usage_log
    WHERE user_id = user_uuid
    AND date >= week_start
    AND date <= CURRENT_DATE;
    
    RETURN total_usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO authenticated;
GRANT ALL ON thoughts TO authenticated;
GRANT ALL ON usage_log TO authenticated;
GRANT EXECUTE ON FUNCTION increment_usage_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_usage_count(uuid) TO authenticated;