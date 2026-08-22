import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import { errorResponse, sanitizeText, validateString } from './_validate.js';
import { applyCors, checkRateLimit, hasValidJsonBody } from './_security.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;
const vapidReady = Boolean(publicVapidKey && privateVapidKey);
const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

if (vapidReady) webpush.setVapidDetails('mailto:support@aya-game.com', publicVapidKey, privateVapidKey);
else console.error('[send-notifications] VAPID keys not configured in environment variables.');

async function verifyAdminAuth(req) {
  const authHeader = String(req.headers.authorization || '');
  if (!supabase || !authHeader.startsWith('Bearer ')) return false;
  const { data, error } = await supabase.auth.getUser(authHeader.slice(7));
  if (error || !data?.user?.email) return false;
  const { data: admin, error: adminError } = await supabase
    .from('admin_users').select('email').eq('email', data.user.email.toLowerCase()).maybeSingle();
  return !adminError && Boolean(admin);
}

export default async function handler(req, res) {
  applyCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return errorResponse(res, 405, 'Method not allowed');
  if (checkRateLimit(req, res, 'send-notifications') || !hasValidJsonBody(req, res)) return;
  if (!supabase) return errorResponse(res, 500, 'Supabase admin client is not configured on the server.');
  if (!vapidReady) return errorResponse(res, 503, 'Push notifications are not configured.');
  if (!(await verifyAdminAuth(req))) return errorResponse(res, 403, 'Unauthorized: Admin privileges required to broadcast notifications.');

  const { title, body, url = '/game' } = req.body || {};
  const titleError = validateString(title, 'title', 100);
  const bodyError = validateString(body, 'body', 500);
  if (titleError) return errorResponse(res, 400, titleError);
  if (bodyError) return errorResponse(res, 400, bodyError);
  if (typeof url !== 'string' || !url.startsWith('/') || url.length > 500) return errorResponse(res, 400, 'url must be a relative path');

  try {
    const { data: subscriptions, error } = await supabase.from('push_subscriptions').select('id, subscription');
    if (error) return errorResponse(res, 500, 'Failed to load push subscriptions.');
    const payload = JSON.stringify({ title: sanitizeText(title), body: sanitizeText(body), url, icon: '/icons/icon-192.png' });
    const results = await Promise.all((subscriptions || []).map(async (sub) => {
      try {
        if (!sub.subscription?.endpoint) throw new Error('Invalid subscription');
        await webpush.sendNotification(sub.subscription, payload);
        return true;
      } catch (pushError) {
        if (pushError?.statusCode === 404 || pushError?.statusCode === 410) await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        return false;
      }
    }));
    const sent = results.filter(Boolean).length;
    return res.status(200).json({ success: true, total: results.length, sent, failed: results.length - sent });
  } catch (error) {
    console.error('[send-notifications] Fatal error:', error instanceof Error ? error.message : 'unknown');
    return errorResponse(res, 500, 'Internal server error');
  }
}
