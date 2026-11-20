// Danh mục bài hát demo (Group 040) dùng khi chưa có bảng `songs` trên Supabase.
// Mã bài hát và thời lượng khớp với src/frontend/src/utils/mockData.js để trình phát
// trên giao diện stream được ngay. Khi tầng dữ liệu (Group 080) có bảng `songs`,
// repository sẽ ưu tiên dữ liệu thật và chỉ quay về danh mục này nếu không tìm thấy.

export const demoSongs = [
  { song_id: 't1', title: 'Nàng thơ', artist: 'Hoàng Dũng', album: '25', genre: 'ballad', duration: 261 },
  { song_id: 't2', title: 'Bước qua mùa cô đơn', artist: 'Vũ.', album: 'Một vạn năm', genre: 'indie', duration: 248 },
  { song_id: 't3', title: 'Có em', artist: 'Madihu, Low G', album: 'Có em', genre: 'rnb', duration: 224 },
  { song_id: 't4', title: 'Thích em hơi nhiều', artist: 'Wren Evans', album: 'Loi Choi', genre: 'vpop', duration: 192 },
  { song_id: 't5', title: 'Chuyện rằng', artist: 'Thịnh Suy', album: 'Chuyện rằng', genre: 'indie', duration: 253 },
  { song_id: 't6', title: 'Tình đắng như ly cà phê', artist: '大木, Nân', album: 'Tình đắng', genre: 'vpop', duration: 217 },
  { song_id: 't7', title: '3107', artist: 'W/n, Duongg, Nâu', album: '3107', genre: 'rnb', duration: 222 },
  { song_id: 't8', title: 'Midnight Coffee', artist: 'AuraTune Studio', album: 'Lofi bên cửa sổ', genre: 'lofi', duration: 204 },
  { song_id: 't9', title: 'Rainy Window', artist: 'AuraTune Studio', album: 'Lofi bên cửa sổ', genre: 'lofi', duration: 178 },
  { song_id: 't10', title: 'Slow Afternoon', artist: 'AuraTune Studio', album: 'Deep Focus', genre: 'chill', duration: 252 },
].map((song) => ({ ...song, audio_url: null, is_active: true, source: 'demo' }));
