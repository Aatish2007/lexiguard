import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL as CONFIG_URL, SUPABASE_ANON_KEY as CONFIG_KEY } from './supabaseConfig';

// Read from Vite environment variables first, then fallback to supabaseConfig.ts
const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export const supabaseUrl = envUrl || CONFIG_URL?.trim() || '';
export const supabaseAnonKey = envKey || CONFIG_KEY?.trim() || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const SUPABASE_UNCONFIGURED_MESSAGE =
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Secrets.';

// Single shared Supabase client instance
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
