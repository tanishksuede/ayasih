import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://hstddacoqsmztmbvvhhr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdGRkYWNvcXNtenRtYnZ2aGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjgxODYsImV4cCI6MjEwMzUwNDE4Nn0.EXwnivlEoOkZViWS6UnaWTbSNPdjBB068AOsHU7SVpI'
);

async function fixOnboarding() {
    const { data: users, error } = await supabase.from('users').select('id, name, username, onboarding_complete, total_xp, stories_completed, level, assessment_completed').limit(10);
    console.log(users);
}
fixOnboarding();
