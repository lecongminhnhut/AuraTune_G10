// Supabase Client for DB & OAuth integration
// Safe fallback to null in local demo mode or browser environment without breaking app startup

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env nằm ở thư mục gốc dự án (cha của thư mục database)
dotenv.config({ path: path.resolve(__dirname, '../.env') });



const envUrl = process.env.SUPABASE_URL;
// This client is backend-only. Auth tables contain password hashes and session
// tokens, so never use the public anon key for server-side writes.
const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

export const supabase = (envUrl && envKey) ? createClient(envUrl, envKey) : null;

if (!supabase) {
  console.warn('Supabase is disabled. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in src/.env.');
}




//==========VÍ DỤ SỬ DỤNG===========
// const { supabase } = require('../database/supabaseClient');

// async function testDb() {
//     const { data, error } = await supabase.from('ten_bang_cua_ban').select('*');
//     if (error) console.error("Lỗi:", error);
//     else console.log("Dữ liệu:", data);
// }

// testDb();
