const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load biến môi trường từ file .env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY trong file .env");
}

// Khởi tạo client kết nối với Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Xuất client ra để các file khác trong Node.js có thể sử dụng
module.exports = { supabase };


//==========VÍ DỤ SỬ DỤNG===========
// const { supabase } = require('../database/supabaseClient');

// async function testDb() {
//     const { data, error } = await supabase.from('ten_bang_cua_ban').select('*');
//     if (error) console.error("Lỗi:", error);
//     else console.log("Dữ liệu:", data);
// }

// testDb();