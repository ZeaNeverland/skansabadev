import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Get environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createOrganizationTables() {
    console.log('Creating organization tables...');

    try {
        // Check if tables already exist
        console.log('Checking if org_levels table exists...');
        const { data: checkData, error: checkError } = await supabase
            .from('org_levels')
            .select('id')
            .limit(1);

        if (!checkError) {
            console.log('Tables already exist. Skipping creation.');
            return;
        }

        // If we get here, tables don't exist or there's an error
        console.log('Tables do not exist. Please create them manually through Supabase dashboard.');
        console.log('Error:', checkError.message);

        // For development, we can try to create the tables directly
        // But this requires a service key which we don't have in the .env file
        console.log('\nTo create the tables manually:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Run the SQL from: supabase/migrations/20251007134800_create_organization_tables.sql');

    } catch (error) {
        console.error('Error:', error);
    }
}

createOrganizationTables();