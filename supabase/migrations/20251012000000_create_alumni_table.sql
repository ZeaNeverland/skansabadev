-- Create alumni table
CREATE TABLE IF NOT EXISTS public.alumni (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  angkatan text NOT NULL,
  pekerjaan text,
  perusahaan text,
  lokasi text,
  image_url text,
  quote text,
  linkedin text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Enable read access for authenticated users" 
ON public.alumni
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow admins to perform all actions
CREATE POLICY "Enable all actions for admins"
ON public.alumni
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated' AND auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role = 'admin'
));