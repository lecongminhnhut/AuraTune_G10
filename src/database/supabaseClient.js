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
const envKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY; 

export const supabase = (envUrl && envKey) ? createClient(envUrl, envKey) : null;

if (!supabase) {
  console.warn("⚠️ CẢNH BÁO: Thiếu biến môi trường SUPABASE.");
}




//==========VÍ DỤ SỬ DỤNG===========
// const { supabase } = require('../database/supabaseClient');

// async function testDb() {
//     const { data, error } = await supabase.from('ten_bang_cua_ban').select('*');
//     if (error) console.error("Lỗi:", error);
//     else console.log("Dữ liệu:", data);
// }

// testDb();