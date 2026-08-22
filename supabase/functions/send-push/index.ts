import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2.44.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, title, body, icon, url } = await req.json();

    if (!user_id || !title || !body) {
      throw new Error('user_id, title, and body are required.');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the user's push subscription from the database
    const { data: subRecord, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user_id)
      .single();

    if (error || !subRecord || !subRecord.subscription) {
      console.error('Failed to get subscription:', error);
      throw new Error('No push subscription found for this user.');
    }

    const pushSubscription = subRecord.subscription;

    // Configure Web Push with VAPID keys
    const publicVapidKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
    const privateVapidKey = Deno.env.get('VAPID_PRIVATE_KEY')!;
    const subject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@example.com';

    webpush.setVapidDetails(subject, publicVapidKey, privateVapidKey);

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/pwa-192x192.png',
      url: url || '/'
    });

    // Send the notification
    await webpush.sendNotification(pushSubscription, payload);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
