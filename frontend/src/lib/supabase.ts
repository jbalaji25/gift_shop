import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

export const isMock = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');

if (isMock) {
  console.warn('Missing Supabase environment variables. Using placeholders for development. Database operations will fail or use demo data.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
