import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://hstddacoqsmztmbvvhhr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdGRkYWNvcXNtenRtYnZ2aGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjgxODYsImV4cCI6MjEwMzUwNDE4Nn0.EXwnivlEoOkZViWS6UnaWTbSNPdjBB068AOsHU7SVpI'
);

async function checkPhones() {
    const { data: user1 } = await supabase.from('users').select('*').eq('mobile', '8103059448').maybeSingle();
    const { data: user2 } = await supabase.from('users').select('*').eq('mobile', '9111897728').maybeSingle();
    console.log("8103059448:", user1 ? "EXISTS" : "NOT FOUND");
    console.log("9111897728:", user2 ? "EXISTS" : "NOT FOUND");
}
checkPhones();
