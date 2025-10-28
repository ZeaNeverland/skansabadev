-- Create facilities table
CREATE TABLE IF NOT EXISTS public.facilities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  image_url text,
  features text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Enable read access for all users" 
ON public.facilities
FOR SELECT
USING (true);

-- Create policy to allow admins to perform all actions
CREATE POLICY "Enable all actions for admins"
ON public.facilities
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated' AND auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role = 'admin'
));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_facilities_updated_at
BEFORE UPDATE ON public.facilities
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create storage bucket for facilities images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('facilities', 'facilities', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for facilities bucket
CREATE POLICY "Allow public read access on facilities bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'facilities');

CREATE POLICY "Allow authenticated users to upload to facilities bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'facilities' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from facilities bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'facilities' AND auth.role() = 'authenticated');