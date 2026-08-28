import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://boxuixgyxzbxdrvlevuu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJveHVpeGd5eHpieGRydmxldnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTI2NDIsImV4cCI6MjA5Nzg4ODY0Mn0.ZyAIsgCALqauv1qr4BWu-LeYk8M5yNASgnV0rfioEPY'
);

async function checkPhones() {
    const { data: user1 } = await supabase.from('users').select('*').eq('mobile', '8103059448').maybeSingle();
    const { data: user2 } = await supabase.from('users').select('*').eq('mobile', '9111897728').maybeSingle();
    console.log("8103059448:", user1 ? "EXISTS" : "NOT FOUND");
    console.log("9111897728:", user2 ? "EXISTS" : "NOT FOUND");
}
checkPhones();
