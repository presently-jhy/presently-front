import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rewftufssxzqgdqrsqlz.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJld2Z0dWZzc3h6cWdkcXJzcWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzE4NzUsImV4cCI6MjA2MTA0Nzg3NX0.7lQ6TRurwtOPBuWf7CPlTMFs3EXb51IcS0XaX6sLTCE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
