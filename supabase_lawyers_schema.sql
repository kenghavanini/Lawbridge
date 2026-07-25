-- Run this SQL in your Supabase SQL Editor to create the live lawyers table with unique Bar IDs for upserting:
CREATE TABLE IF NOT EXISTS lawyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  bar_id TEXT UNIQUE NOT NULL,
  jurisdiction TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Allow public read access for verification checks
CREATE POLICY "Allow public lawyer verification" ON lawyers FOR SELECT USING (true);
