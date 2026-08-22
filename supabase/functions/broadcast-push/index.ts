import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2.44.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client using the service role key so we can fetch all users later
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the caller's JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user || !user.email) {
      throw new Error('Invalid authentication token or no email associated.');
    }

    // Check if caller is an admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email)
      .maybeSingle();

    if (!adminData) {
      throw new Error('Unauthorized. You are not an admin.');
    }

    // Parse notification request
    const { title, body, icon, url } = await req.json();
    if (!title || !body) throw new Error('title and body are required.');

    // Fetch all push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('subscription');

    if (subError) throw subError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No subscriptions found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Configure Web Push with VAPID keys
    const publicVapidKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
    const privateVapidKey = Deno.env.get('VAPID_PRIVATE_KEY')!;
    const subject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@example.com';

    webpush.setVapidDetails(subject, publicVapidKey, privateVapidKey);

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/pwa-192x192.png',
      url: url || '/game'
    });

    let successCount = 0;
    let failCount = 0;

    // Send notifications in parallel (map to promises)
    const promises = subscriptions.map(async (subRecord: any) => {
      try {
        await webpush.sendNotification(subRecord.subscription, payload);
        successCount++;
      } catch (err) {
        console.error('Push failed for a subscription:', err);
        failCount++;
        // If web-push returns 410 or 404, it means the subscription is no longer valid.
        // We could delete it from the database here to keep it clean.
      }
    });

    await Promise.all(promises);

    return new Response(JSON.stringify({ success: true, sent: successCount, failed: failCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error broadcasting push notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
