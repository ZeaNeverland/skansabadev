-- Create kurikulum table for curriculum documents
create table if not exists public.kurikulum (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text,
  file_url text not null,
  file_path text,
  file_size bigint,
  update_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create updated_at trigger
create trigger handle_updated_at before update on public.kurikulum
  for each row execute procedure moddatetime (updated_at);

-- Enable RLS (Row Level Security)
alter table public.kurikulum enable row level security;

-- Create policies for kurikulum table
-- Allow public read access
create policy "Allow public read access on kurikulum" on public.kurikulum
  for select using (true);

-- Allow authenticated users to insert
create policy "Allow authenticated users to insert kurikulum" on public.kurikulum
  for insert with check (auth.role() = 'authenticated');

-- Allow authenticated users to update their own records
create policy "Allow authenticated users to update kurikulum" on public.kurikulum
  for update using (auth.role() = 'authenticated');

-- Allow authenticated users to delete
create policy "Allow authenticated users to delete kurikulum" on public.kurikulum
  for delete using (auth.role() = 'authenticated');

-- Create storage bucket for kurikulum documents if it doesn't exist
insert into storage.buckets (id, name, public)
values ('kurikulum', 'kurikulum', true)
on conflict (id) do nothing;

-- Create storage policies for kurikulum bucket
create policy "Allow public read access on kurikulum bucket" on storage.objects
  for select using (bucket_id = 'kurikulum');

create policy "Allow authenticated users to upload to kurikulum bucket" on storage.objects
  for insert with check (bucket_id = 'kurikulum' and auth.role() = 'authenticated');

create policy "Allow authenticated users to delete from kurikulum bucket" on storage.objects
  for delete using (bucket_id = 'kurikulum' and auth.role() = 'authenticated');
