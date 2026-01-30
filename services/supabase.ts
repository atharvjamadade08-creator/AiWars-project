
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pixxxfxxdogkmkqebydy.supabase.co';
const supabaseAnonKey = 'sb_publishable_lpOGfsl0KBl5uuhnZD4V1w_cpkX_uYf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
