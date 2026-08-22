import { createClient } from '@supabase/supabase-js';
import { errorResponse, validateUUID } from './_validate.js';
import { applyCors, checkRateLimit, hasValidJsonBody } from './_security.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseAdmin;
try {
  if (supabaseUrl && serviceRoleKey) {
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
} catch (e) {
  console.error('[delete-account] Failed to initialize Supabase admin client:', e);
}

export default async function handler(req, res) {
  applyCors(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }
  if (checkRateLimit(req, res, 'delete-account') || !hasValidJsonBody(req, res)) return;

  if (!supabaseAdmin) {
    return res.status(500).json({
      success: false,
      error: 'Supabase admin client is not configured on the server.'
    });
  }

  try {
    const { userId } = req.body || {};

    const userIdError = validateUUID(userId, 'userId');
    if (userIdError) return errorResponse(res, 400, userIdError);

    // 1. Authenticate Requester (Session / Token Validation)
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) return errorResponse(res, 401, 'Authorization token is required.');
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData?.user) return errorResponse(res, 401, 'Invalid or expired authentication token.');
    const authenticatedAuthUid = authData.user.id;

    // 2. Fetch target user from public.users table
    const { data: targetUser, error: userFetchError } = await supabaseAdmin
      .from('users')
      .select('id, auth_user_id, mobile, google_id')
      .eq('id', userId)
      .maybeSingle();

    if (userFetchError) {
      console.error('[delete-account] Error fetching user:', userFetchError);
      return res.status(500).json({ success: false, error: 'Failed to look up user profile.' });
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    // 3. Security Verification: Ensure caller is deleting their own account
    const matchesAuthUid = targetUser.auth_user_id === authenticatedAuthUid;
    const matchesGoogleId = targetUser.google_id === authenticatedAuthUid;
    const matchesDirectId = targetUser.id === authenticatedAuthUid;
    if (!matchesAuthUid && !matchesGoogleId && !matchesDirectId) {
      return errorResponse(res, 403, 'Unauthorized. You can only delete your own account.');
    }

    // 4. Soft Delete: Mark public.users record as deactivated with deleted_at timestamp
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        status: 'deactivated',
        deleted_at: now
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[delete-account] Failed to soft-delete user row:', updateError);
      return res.status(500).json({
        success: false,
        error: `Failed to deactivate account: ${updateError.message}`
      });
    }

    // 5. Clean up Supabase Auth user if linked (frees up phone number/email for future registrations)
    const targetAuthUid = targetUser.auth_user_id || (authenticatedAuthUid ? authenticatedAuthUid : null);
    if (targetAuthUid && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(targetAuthUid);
        console.log(`[delete-account] Successfully deleted auth.users entry for auth_uid: ${targetAuthUid}`);
      } catch (authDeleteErr) {
        console.warn('[delete-account] Warning: Failed to remove auth.users entry:', authDeleteErr?.message || authDeleteErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Account successfully deactivated and scheduled for deletion in 30 days.',
      deleted_at: now
    });
  } catch (err) {
    console.error('[delete-account] Unexpected exception during account deletion:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred while deleting account.'
    });
  }
}
