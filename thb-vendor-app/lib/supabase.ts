import { createClient } from '@supabase/supabase-js';

// Nota: Dalam Expo, process.env tidak berfungsi secara automatik seperti Next.js.
// Untuk mockup ini, sila masukkan terus URL dan Key anda di sini.
const supabaseUrl = 'https://lkkoznbqgitrgdkeehbt.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_n4ns5yVynFJgUgLYGh5aZA_7NB1hguj';

// Pastikan ada kata kunci 'export' di depan const
export const supabase = createClient(supabaseUrl, supabaseAnonKey);