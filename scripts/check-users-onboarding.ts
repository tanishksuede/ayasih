import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://boxuixgyxzbxdrvlevuu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJveHVpeGd5eHpieGRydmxldnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTI2NDIsImV4cCI6MjA5Nzg4ODY0Mn0.ZyAIsgCALqauv1qr4BWu-LeYk8M5yNASgnV0rfioEPY'
);

async function fixOnboarding() {
    const { data: users, error } = await supabase.from('users').select('id, name, username, onboarding_complete, total_xp, stories_completed, level, assessment_completed').limit(10);
    console.log(users);
}
fixOnboarding();
