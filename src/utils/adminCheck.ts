import { supabase } from './supabase';

/**
 * Check if the currently authenticated user is an admin.
 * Queries the `admin_users` table in Supabase (RLS disabled).
 * Also checks user's email from the Supabase auth session.
 * Persists the email to localStorage for downstream components.
 */
export async function checkIsAdmin(): Promise<boolean> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const email = session?.user?.email;
        if (!email) return false;

        // Persist email for downstream components that read it synchronously
        try { localStorage.setItem('aya_google_email', email); } catch {}

        // Query the admin_users table (backend-driven, no hardcoded emails)
        const { data } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        return !!data;
    } catch (err) {
        console.error('[AdminCheck] Failed to check admin status:', err);
        return false;
    }
}
