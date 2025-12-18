-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  student text NOT NULL,
  event text NOT NULL,
  date date NOT NULL,
  level text NOT NULL,
  image_url text,
  year text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Enable read access for all users" 
ON public.achievements
FOR SELECT
USING (true);

-- Create policy to allow admins to perform all actions
CREATE POLICY "Enable all actions for admins"
ON public.achievements
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

CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create storage bucket for achievements images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('achievements', 'achievements', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for achievements bucket
CREATE POLICY "Allow public read access on achievements bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'achievements');

CREATE POLICY "Allow authenticated users to upload to achievements bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'achievements' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from achievements bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'achievements' AND auth.role() = 'authenticated');