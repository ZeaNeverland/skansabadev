// Script to manually apply organization tables migration
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
    console.log('Applying organization tables migration...');

    try {
        // Create org_levels table
        const { error: levelsError } = await supabase.rpc('exec_sql', {
            sql: `
        CREATE TABLE IF NOT EXISTS public.org_levels (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          order_index integer not null default 1,
          created_at timestamp with time zone not null default now(),
          updated_at timestamp with time zone
        );
      `
        });

        if (levelsError) {
            console.error('Error creating org_levels table:', levelsError);
            return;
        }

        console.log('org_levels table created successfully');

        // Create org_members table
        const { error: membersError } = await supabase.rpc('exec_sql', {
            sql: `
        CREATE TABLE IF NOT EXISTS public.org_members (
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
      `
        });

        if (membersError) {
            console.error('Error creating org_members table:', membersError);
            return;
        }

        console.log('org_members table created successfully');

        // Enable RLS
        const { error: rlsError1 } = await supabase.rpc('exec_sql', {
            sql: 'ALTER TABLE public.org_levels ENABLE ROW LEVEL SECURITY;'
        });

        if (rlsError1) {
            console.error('Error enabling RLS on org_levels:', rlsError1);
        }

        const { error: rlsError2 } = await supabase.rpc('exec_sql', {
            sql: 'ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;'
        });

        if (rlsError2) {
            console.error('Error enabling RLS on org_members:', rlsError2);
        }

        console.log('Row Level Security enabled on both tables');

        // Create policies
        const policies = [
            `CREATE POLICY "Read org_levels for all" ON public.org_levels FOR SELECT USING (true);`,
            `CREATE POLICY "Read org_members for all" ON public.org_members FOR SELECT USING (true);`,
            `CREATE POLICY "Write org_levels by admin or kepala_sekolah" ON public.org_levels FOR ALL USING (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah'))) WITH CHECK (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah')));`,
            `CREATE POLICY "Write org_members by admin or kepala_sekolah" ON public.org_members FOR ALL USING (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah'))) WITH CHECK (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','kepala_sekolah')));`
        ];

        for (const policy of policies) {
            const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy });
            if (policyError) {
                console.error('Error creating policy:', policyError);
            }
        }

        console.log('Policies created successfully');

        // Create triggers
        const { error: triggerError } = await supabase.rpc('exec_sql', {
            sql: `
        CREATE OR REPLACE FUNCTION public.set_updated_at()
        RETURNS trigger AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER set_updated_at_org_levels
        BEFORE UPDATE ON public.org_levels
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
        
        CREATE TRIGGER set_updated_at_org_members
        BEFORE UPDATE ON public.org_members
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
      `
        });

        if (triggerError) {
            console.error('Error creating triggers:', triggerError);
        } else {
            console.log('Triggers created successfully');
        }

        console.log('Migration applied successfully!');
    } catch (error) {
        console.error('Error applying migration:', error);
    }
}

applyMigration();