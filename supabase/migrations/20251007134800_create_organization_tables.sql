-- Organization structure tables
-- Requires pgcrypto for gen_random_uuid (enabled by default on Supabase)

create table if not exists public.org_levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  order_index integer not null default 1,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone
);

create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.org_levels(id) on delete cascade,
  name text not null,
  position text not null,
  photo_url text,
  description text,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  order_index integer not null default 1,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone
);

-- Enable RLS
alter table public.org_levels enable row level security;
alter table public.org_members enable row level security;

-- Helper policy predicate: user is admin or kepala_sekolah
-- We'll inline the check in each policy using EXISTS on profiles

-- Read policies: allow anyone to read (including anonymous) if you prefer public data
create policy "Read org_levels for all" on public.org_levels for select using (true);
create policy "Read org_members for all" on public.org_members for select using (true);

-- Write policies: only users with role in ('admin','kepala_sekolah')
create policy "Write org_levels by admin or kepala_sekolah" on public.org_levels
  for all using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah')
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah')
    )
  );

create policy "Write org_members by admin or kepala_sekolah" on public.org_members
  for all using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah')
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah')
    )
  );

-- Optional: maintain updated_at via trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_org_levels
before update on public.org_levels
for each row execute function public.set_updated_at();

create trigger set_updated_at_org_members
before update on public.org_members
for each row execute function public.set_updated_at();
