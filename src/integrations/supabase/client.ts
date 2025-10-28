// src/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with fallback to process.env (for Vite)
const getEnv = (key: string): string => {
  // @ts-ignore
  return import.meta.env[key] || process.env[key] || '';
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

// Debug log to check if env variables are loaded
console.log('Supabase URL:', SUPABASE_URL || 'MISSING');
console.log('Supabase Key:', SUPABASE_ANON_KEY ? '***KEY_LOADED***' : 'MISSING');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  }
});
