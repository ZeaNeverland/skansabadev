import { supabase } from '@/integrations/supabase/client';

// This function initializes the organization tables if they don't exist
export const initOrganizationTables = async () => {
    try {
        console.log('Initializing organization tables...');

        // Check if org_levels table exists by attempting to query it
        const { error: checkError } = await supabase
            .from('org_levels')
            .select('id')
            .limit(1)
            .single();

        // If there's no error or the error is not about the table not existing, tables might already exist
        if (!checkError || !checkError.message.includes('relation') || !checkError.message.includes('does not exist')) {
            console.log('Organization tables may already exist');
            return { success: true, message: 'Tables may already exist' };
        }

        // If we get here, the tables don't exist and we need to create them
        // Note: In a real application, you would use the Supabase CLI or dashboard to run migrations
        // This is just a temporary workaround for development
        console.log('Organization tables do not exist. Please run the migration manually.');

        return {
            success: false,
            message: 'Tables do not exist. Please run the migration manually using Supabase CLI or dashboard.'
        };
    } catch (error) {
        console.error('Error initializing organization tables:', error);
        return {
            success: false,
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
};

// Function to create sample data for testing
export const createSampleOrganizationData = async () => {
    try {
        // Create sample levels
        const { data: level1, error: level1Error } = await supabase
            .from('org_levels')
            .insert({
                name: 'Kepala Sekolah',
                order_index: 1
            })
            .select()
            .single();

        if (level1Error) throw level1Error;

        const { data: level2, error: level2Error } = await supabase
            .from('org_levels')
            .insert({
                name: 'Ketua Konsentrasi Keahlian',
                order_index: 2
            })
            .select()
            .single();

        if (level2Error) throw level2Error;

        // Create sample members
        const members = [
            {
                level_id: level1.id,
                name: 'Drs. Bambang Sumarno, M.Pd',
                position: 'Kepala Sekolah',
                description: 'Memimpin seluruh kegiatan sekolah dengan visi mencetak generasi unggul',
                is_active: true,
                order_index: 1
            },
            {
                level_id: level2.id,
                name: 'Haris Budiawan, S.PD',
                position: 'Ketua Konsentrasi Keahlian',
                description: 'Memimpin dan mengkoordinasikan semua kegiatan di Jurusan RPL',
                is_active: true,
                order_index: 1
            }
        ];

        const { error: membersError } = await supabase
            .from('org_members')
            .insert(members);

        if (membersError) throw membersError;

        console.log('Sample organization data created successfully');
        return { success: true, message: 'Sample data created successfully' };
    } catch (error) {
        console.error('Error creating sample organization data:', error);
        return {
            success: false,
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
};