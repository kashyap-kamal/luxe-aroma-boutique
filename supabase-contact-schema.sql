-- Contact Messages Table Schema for Aromé Luxe
-- This script creates the contact_messages table with proper RLS policies

-- Create the contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Policy 1: Allow anyone to insert contact messages (for public contact form)
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON contact_messages;

-- Create new policy that allows anonymous users to insert
CREATE POLICY "Allow anonymous insert on contact_messages" ON contact_messages
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "Allow authenticated insert on contact_messages" ON contact_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to read all contact messages (for admin)
CREATE POLICY "Allow authenticated read on contact_messages" ON contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy 3: Allow authenticated users to update contact messages (for admin)
CREATE POLICY "Allow authenticated update on contact_messages" ON contact_messages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 4: Allow authenticated users to delete contact messages (for admin)
CREATE POLICY "Allow authenticated delete on contact_messages" ON contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE contact_messages IS 'Stores contact form submissions from the website';
COMMENT ON COLUMN contact_messages.id IS 'Unique identifier for each contact message';
COMMENT ON COLUMN contact_messages.name IS 'Full name of the person submitting the contact form';
COMMENT ON COLUMN contact_messages.email IS 'Email address of the person submitting the contact form';
COMMENT ON COLUMN contact_messages.subject IS 'Subject/category of the contact message';
COMMENT ON COLUMN contact_messages.message IS 'The actual message content';
COMMENT ON COLUMN contact_messages.status IS 'Current status of the message: new, read, replied, or closed';
COMMENT ON COLUMN contact_messages.created_at IS 'Timestamp when the message was created';
COMMENT ON COLUMN contact_messages.updated_at IS 'Timestamp when the message was last updated';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON contact_messages TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
