import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rewftufssxzqgdqrsqlz.supabase.co';
const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJld2Z0dWZzc3h6cWdkcXJzcWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzE4NzUsImV4cCI6MjA2MTA0Nzg3NX0.7lQ6TRurwtOPBuWf7CPlTMFs3EXb51IcS0XaX6sLTCE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});
