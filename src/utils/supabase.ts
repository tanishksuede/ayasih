import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://boxuixgyxzbxdrvlevuu.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJveHVpeGd5eHpieGRydmxldnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTI2NDIsImV4cCI6MjA5Nzg4ODY0Mn0.ZyAIsgCALqauv1qr4BWu-LeYk8M5yNASgnV0rfioEPY';

let rawUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || SUPABASE_URL;
if (typeof rawUrl !== 'string' || !rawUrl.trim()) rawUrl = SUPABASE_URL;
let supabaseUrl = rawUrl.replace(/['"]/g, '').trim();

let rawKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || SUPABASE_ANON_KEY;
if (typeof rawKey !== 'string' || !rawKey.trim()) rawKey = SUPABASE_ANON_KEY;
const supabaseAnonKey = rawKey.replace(/['"]/g, '').trim();

if (supabaseUrl && !supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://' + supabaseUrl;
}

// On iOS Safari, detectSessionInUrl can cause a hang/loop when the URL doesn't
// contain an auth callback hash. Only enable it when we're actually on an OAuth
// redirect URL (i.e. the URL contains #access_token or ?code=).
const isOAuthCallback = typeof window !== 'undefined' && (
    window.location.hash.includes('access_token') ||
    window.location.hash.includes('refresh_token') ||
    window.location.search.includes('code=')
);

let supabaseInstance: any;

try {
  supabaseInstance = createClient(
    supabaseUrl || 'https://dummy.supabase.co',
    supabaseAnonKey || 'dummy-key',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: isOAuthCallback,
        storageKey: 'aya-supabase-auth',
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    }
  );
} catch (error) {
  console.error('[Supabase] Fatal error initializing client. Check your VITE_SUPABASE_URL.', error);
  // Fallback to dummy so the app doesn't crash on boot
  supabaseInstance = createClient('https://dummy.supabase.co', 'dummy-key');
}

export const supabase = supabaseInstance;
