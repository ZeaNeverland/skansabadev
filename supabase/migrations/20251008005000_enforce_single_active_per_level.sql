-- Enforce at most one active member per level
create unique index if not exists org_members_one_active_per_level
on public.org_members(level_id)
where is_active = true;
