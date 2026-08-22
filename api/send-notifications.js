import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabase;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  }
} catch (e) {
  console.error('[send-notifications] Supabase init error:', e);
}

// Configure Web Push VAPID details
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || 'BKuBEyjIX-OtnnyJ7cyBMLwAycYv6POyGVFIxPnlzbReZLxv3S-QP9wcJ-YIE38w_al1tqIDwSf41MUG8JgipZE';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || 'HHW51N5h_f1ofvSD3fJvVvToP93qk9lwr7_X7PuuPXo';

try {
  webpush.setVapidDetails(
    'mailto:support@aya-game.com',
    publicVapidKey,
    privateVapidKey
  );
} catch (err) {
  console.error('[send-notifications] Failed to set VAPID details:', err);
}

const FOUNDER_EMAIL = 'anitadhakad333@gmail.com';

/**
 * Verify whether the requesting user is an authorized admin.
 */
async function verifyAdminAuth(req) {
  const adminHeader = req.headers['x-admin-email'];
  const authHeader = req.headers['authorization'];
  let callerEmail = adminHeader ? String(adminHeader).trim().toLowerCase() : null;

  if (!callerEmail && req.body && req.body.adminEmail) {
    callerEmail = String(req.body.adminEmail).trim().toLowerCase();
  }

  // Check Bearer JWT token if available
  if (!callerEmail && authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const { data: authData } = await supabase.auth.getUser(token);
      if (authData?.user?.email) {
        callerEmail = authData.user.email.trim().toLowerCase();
      }
    } catch (e) {
      console.warn('[send-notifications] Bearer token verification failed:', e);
    }
  }

  if (!callerEmail) {
    return false;
  }

  // Founder has default admin privileges
  if (callerEmail === FOUNDER_EMAIL) {
    return true;
  }

  // Check admin_users table in Supabase
  try {
    const { data } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', callerEmail)
      .maybeSingle();

    return !!data;
  } catch (err) {
    console.error('[send-notifications] Admin check DB error:', err);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client is not configured on the server.' });
  }

  try {
    // ── 1. Admin Authentication Check ───────────────────────────────────────
    const isAdmin = await verifyAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Admin privileges required to broadcast notifications.'
      });
    }

    // ── 2. Input Validation (For Broadcast Requests) ────────────────────────
    let title = req.body?.title;
    let body = req.body?.body;
    let url = req.body?.url || '/game';

    if (req.method === 'POST') {
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ success: false, error: 'Notification title is required.' });
      }
      if (!body || typeof body !== 'string' || !body.trim()) {
        return res.status(400).json({ success: false, error: 'Notification body is required.' });
      }
      title = title.trim();
      body = body.trim();
    } else {
      title = '🌟 At Your Age (AYA)';
      body = 'Your daily challenge is waiting!';
    }

    // ── 3. Fetch Subscriptions ─────────────────────────────────────────────
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('id, subscription, user_id');

    if (fetchError) {
      console.error('[send-notifications] Error fetching subscriptions:', fetchError);
      return res.status(500).json({ success: false, error: fetchError.message });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        sent: 0,
        failed: 0,
        total: 0,
        message: 'No push subscriptions found in database'
      });
    }

    // ── 4. Dispatch Web Push Notifications ─────────────────────────────────
    const payload = JSON.stringify({
      title,
      body,
      url,
      icon: '/icons/icon-192.png'
    });

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        if (!sub.subscription || !sub.subscription.endpoint) {
          return { status: 'rejected', subId: sub.id, error: 'Invalid subscription object' };
        }
        await webpush.sendNotification(sub.subscription, payload);
        return { status: 'fulfilled', subId: sub.id };
      } catch (err) {
        console.error(`[send-notifications] Push failed for sub ${sub.id}:`, err?.statusCode || err?.message);

        // Delete expired/invalid subscriptions (HTTP 404 or 410)
        if (err && (err.statusCode === 404 || err.statusCode === 410)) {
          try {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            console.log(`[send-notifications] Removed expired subscription ${sub.id}`);
          } catch (delErr) {
            console.warn(`[send-notifications] Failed to delete sub ${sub.id}:`, delErr);
          }
        }

        return { status: 'rejected', subId: sub.id, error: err?.message || 'Push delivery failed' };
      }
    });

    const results = await Promise.allSettled(sendPromises);

    let sentCount = 0;
    let failedCount = 0;

    results.forEach((res) => {
      if (res.status === 'fulfilled' && res.value?.status === 'fulfilled') {
        sentCount++;
      } else {
        failedCount++;
      }
    });

    return res.status(200).json({
      success: true,
      total: subscriptions.length,
      sent: sentCount,
      failed: failedCount
    });

  } catch (error) {
    console.error('[send-notifications] Fatal Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
