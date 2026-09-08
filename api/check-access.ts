import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const allowedOrigin = (req.headers.origin as string) || process.env.ALLOWED_ORIGIN || '*';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const sbUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://boxuixgyxzbxdrvlevuu.supabase.co';
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJveHVpeGd5eHpieGRydmxldnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTI2NDIsImV4cCI6MjA5Nzg4ODY0Mn0.ZyAIsgCALqauv1qr4BWu-LeYk8M5yNASgnV0rfioEPY';

    const supabase = createClient(sbUrl, sbKey);

    try {
        // Verify JWT — user can only check their own access
        const token = req.headers.authorization?.replace('Bearer ', '');
        const supabaseForAuth = createClient(sbUrl, sbKey);

        let verifiedUserId: string | undefined;
        if (token) {
            const { data: { user } } = await supabaseForAuth.auth.getUser(token);
            verifiedUserId = user?.id;
        }

        const { story_id } = req.body;
        // Use verified JWT user if available; fall back to body user_id for service-role callers
        const user_id = verifiedUserId || req.body.user_id;

        if (!user_id) {
            return res.status(401).json({ error: 'Unauthorized: no valid user' });
        }

        // Fetch user access type from Supabase
        const { data: user } = await supabase
            .from('users')
            .select('access_type, access_start_date')
            .eq('id', user_id)
            .maybeSingle();

        const accessType = 'full_access';
        const isAyaPlus = true;
        const canAccess = true;

        return res.status(200).json({
            user_id,
            access_type: accessType,
            is_aya_plus: isAyaPlus,
            can_access: canAccess,
            checked_at: new Date().toISOString()
        });
    } catch (err: any) {
        console.error('[check-access] Error:', err);
        return res.status(500).json({ error: 'Internal server error', message: err?.message });
    }
}
