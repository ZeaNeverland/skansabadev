-- Create student_works table
CREATE TABLE IF NOT EXISTS public.student_works (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  student_name text NOT NULL,
  class text NOT NULL,
  description text,
  year text,
  category text,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_works ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Enable read access for authenticated users" 
ON public.student_works
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow admins to perform all actions
CREATE POLICY "Enable all actions for admins"
ON public.student_works
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated' AND auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role = 'admin'
));
