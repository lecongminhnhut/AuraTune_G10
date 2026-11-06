// Supabase Client for DB & OAuth integration
// Safe fallback to null in local demo mode or browser environment without breaking app startup

let supabase = null

const envUrl = typeof process !== 'undefined' && process.env?.SUPABASE_URL 
  ? process.env.SUPABASE_URL 
  : (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL : null)

const envKey = typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY 
  ? process.env.SUPABASE_ANON_KEY 
  : (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY ? import.meta.env.VITE_SUPABASE_ANON_KEY : null)

export { supabase }
export default supabase




//==========VÍ DỤ SỬ DỤNG===========
// const { supabase } = require('../database/supabaseClient');

// async function testDb() {
//     const { data, error } = await supabase.from('ten_bang_cua_ban').select('*');
//     if (error) console.error("Lỗi:", error);
//     else console.log("Dữ liệu:", data);
// }

// testDb();