import { createClient } from '@supabase/supabase-js';

// رابط مشروعك
const supabaseUrl = 'https://azbgzkuykdzjzoqftpba.supabase.co';

// مفتاحك العام
const supabaseAnonKey = 'sb_publishable_-hLlJZwE83Fs908be1o1Xg_aSu_WZfj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
