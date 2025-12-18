-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  excerpt text,
  content text,
  date date,
  featured boolean DEFAULT false,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Enable read access for all users" 
ON public.news
FOR SELECT
USING (true);

-- Create policy to allow admins to perform all actions
CREATE POLICY "Enable all actions for admins"
ON public.news
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

CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create storage bucket for news images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('news', 'news', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for news bucket
CREATE POLICY "Allow public read access on news bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'news');

CREATE POLICY "Allow authenticated users to upload to news bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from news bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'news' AND auth.role() = 'authenticated');