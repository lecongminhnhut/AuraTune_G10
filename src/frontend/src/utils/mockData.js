export const genres = [
  { id: 'vpop', name: 'V-Pop', cover: 'rose', description: 'Những bản hit Việt được nghe nhiều nhất.' },
  { id: 'indie', name: 'Indie Việt', cover: 'night', description: 'Giai điệu mộc, lời ca nhiều câu chuyện.' },
  { id: 'rnb', name: 'R&B / Soul', cover: 'violet', description: 'Mềm mại, tình cảm và đầy groove.' },
  { id: 'lofi', name: 'Lofi', cover: 'ocean', description: 'Beat chậm, ít lời, hợp để tập trung.' },
  { id: 'ballad', name: 'Ballad', cover: 'sunset', description: 'Những bản tình ca nhẹ nhàng.' },
  { id: 'chill', name: 'Chill / Focus', cover: 'forest', description: 'Âm thanh tối giản cho giờ làm việc.' },
]

export const artists = [
  { id: 'hoang-dung', name: 'Hoàng Dũng', cover: 'rose', bio: 'Ca sĩ, nhạc sĩ với giọng hát ấm và những bản ballad giàu cảm xúc.', isPublic: true },
  { id: 'vu', name: 'Vũ.', cover: 'night', bio: 'Nghệ sĩ indie nổi tiếng với những bài hát về nỗi nhớ và những chuyến đi.', isPublic: true },
  { id: 'madihu', name: 'Madihu', cover: 'sunset', bio: 'Giọng ca trẻ mang màu sắc R&B pha chút indie.', isPublic: true },
  { id: 'wren-evans', name: 'Wren Evans', cover: 'violet', bio: 'Nghệ sĩ trẻ với phong cách pop hiện đại, tươi sáng.', isPublic: true },
  { id: 'thinh-suy', name: 'Thịnh Suy', cover: 'ocean', bio: '', isPublic: true },
  { id: 'nan', name: 'Nân', cover: null, bio: 'Nghệ sĩ độc lập, thường kết hợp cùng các nhà sản xuất trẻ.', isPublic: true },
  { id: 'wn', name: 'W/n', cover: 'aurora', bio: 'Nhà sản xuất âm nhạc với những bản lofi R&B nhẹ nhàng.', isPublic: true },
  { id: 'auratune-studio', name: 'AuraTune Studio', cover: 'forest', bio: 'Phòng thu nội bộ của AuraTune, sản xuất nhạc không lời dùng giấy phép mở cho người nghe tập trung.', isPublic: true },
  { id: 'private-artist', name: 'Nghệ sĩ ẩn', cover: 'violet', bio: 'Hồ sơ chưa được công khai.', isPublic: false },
]

export const albums = [
  { id: 'al-25', title: '25', artistId: 'hoang-dung', releaseDate: '2022-10-05', cover: 'rose', genre: 'ballad' },
  { id: 'al-mot-van-nam', title: 'Một vạn năm', artistId: 'vu', releaseDate: '2022-12-12', cover: 'night', genre: 'indie' },
  { id: 'al-co-em', title: 'Có em', artistId: 'madihu', releaseDate: '2023-04-21', cover: 'sunset', genre: 'rnb' },
  { id: 'al-loi-choi', title: 'Loi Choi', artistId: 'wren-evans', releaseDate: '2023-11-02', cover: 'violet', genre: 'vpop' },
  { id: 'al-chuyen-rang', title: 'Chuyện rằng', artistId: 'thinh-suy', releaseDate: '2020-08-14', cover: 'ocean', genre: 'indie' },
  { id: 'al-tinh-dang', title: 'Tình đắng', artistId: 'nan', releaseDate: '2021-06-30', cover: 'forest', genre: 'vpop' },
  { id: 'al-3107', title: '3107', artistId: 'wn', releaseDate: '2019-07-31', cover: 'aurora', genre: 'rnb' },
  { id: 'al-lofi-cua-so', title: 'Lofi bên cửa sổ', artistId: 'auratune-studio', releaseDate: '2026-09-20', cover: 'ocean', genre: 'lofi' },
  { id: 'al-deep-focus', title: 'Deep Focus', artistId: 'auratune-studio', releaseDate: '2026-10-10', cover: 'forest', genre: 'chill' },
]

// Lời bài hát mẫu do AuraTune Studio tự viết, dùng để minh họa lời chạy theo thời gian.
const midnightLyrics = [
  { time: 0, text: 'Ly cà phê nguội bên khung cửa' },
  { time: 12, text: 'Thành phố ngủ, chỉ còn tiếng mưa' },
  { time: 26, text: 'Gõ từng dòng code trong im lặng' },
  { time: 40, text: 'Để giai điệu thay lời muốn nói' },
  { time: 55, text: 'Chậm lại một chút, hít thở sâu' },
  { time: 70, text: 'Đêm còn dài, mình còn nhau' },
  { time: 88, text: 'Ánh đèn vàng, nhịp beat êm' },
  { time: 104, text: 'Mọi lo âu tan vào màn đêm' },
]

const rainyLyrics = [
  { time: 0, text: 'Mưa rơi nhẹ trên ô cửa kính' },
  { time: 15, text: 'Từng giọt nhỏ kể chuyện ngày qua' },
  { time: 31, text: 'Mở trang sách, quên đi vội vã' },
  { time: 47, text: 'Để lòng mình thôi những xa xôi' },
  { time: 63, text: 'Một buổi chiều, chẳng cần gì nhiều' },
]

const afternoonLyrics = [
  { time: 0, text: 'Nắng chiều nghiêng trên bàn làm việc' },
  { time: 18, text: 'Mọi thứ chậm như một thước phim' },
  { time: 36, text: 'Tập trung vào điều mình yêu thích' },
  { time: 54, text: 'Thời gian trôi, lòng thật bình yên' },
]

export const tracks = [
  { id: 't1', title: 'Nàng thơ', artist: 'Hoàng Dũng', artistId: 'hoang-dung', album: '25', albumId: 'al-25', genre: 'ballad', duration: '4:21', added: '2 ngày trước', cover: 'rose', plays: '1,2 Tr', playCount: 1200000, releaseDate: '2022-10-05' },
  { id: 't2', title: 'Bước qua mùa cô đơn', artist: 'Vũ.', artistId: 'vu', album: 'Một vạn năm', albumId: 'al-mot-van-nam', genre: 'indie', duration: '4:08', added: 'Hôm qua', cover: 'night', plays: '986 N', playCount: 986000, releaseDate: '2022-12-12' },
  { id: 't3', title: 'Có em', artist: 'Madihu, Low G', artistId: 'madihu', album: 'Có em', albumId: 'al-co-em', genre: 'rnb', duration: '3:44', added: 'Hôm qua', cover: 'sunset', plays: '842 N', playCount: 842000, releaseDate: '2023-04-21' },
  { id: 't4', title: 'Thích em hơi nhiều', artist: 'Wren Evans', artistId: 'wren-evans', album: 'Loi Choi', albumId: 'al-loi-choi', genre: 'vpop', duration: '3:12', added: '1 tuần trước', cover: 'violet', plays: '765 N', playCount: 765000, releaseDate: '2023-11-02' },
  { id: 't5', title: 'Chuyện rằng', artist: 'Thịnh Suy', artistId: 'thinh-suy', album: 'Chuyện rằng', albumId: 'al-chuyen-rang', genre: 'indie', duration: '4:13', added: '1 tuần trước', cover: 'ocean', plays: '652 N', playCount: 652000, releaseDate: '2020-08-14' },
  { id: 't6', title: 'Tình đắng như ly cà phê', artist: '大木, Nân', artistId: 'nan', album: 'Tình đắng', albumId: 'al-tinh-dang', genre: 'vpop', duration: '3:37', added: '2 tuần trước', cover: 'forest', plays: '601 N', playCount: 601000, releaseDate: '2021-06-30' },
  { id: 't7', title: '3107', artist: 'W/n, Duongg, Nâu', artistId: 'wn', album: '3107', albumId: 'al-3107', genre: 'rnb', duration: '3:42', added: '2 tuần trước', cover: 'aurora', plays: '588 N', playCount: 588000, releaseDate: '2019-07-31' },
  { id: 't8', title: 'Midnight Coffee', artist: 'AuraTune Studio', artistId: 'auratune-studio', album: 'Lofi bên cửa sổ', albumId: 'al-lofi-cua-so', genre: 'lofi', duration: '3:24', added: 'Hôm nay', cover: 'ocean', plays: '24 N', playCount: 24000, releaseDate: '2026-09-20', lyrics: midnightLyrics },
  { id: 't9', title: 'Rainy Window', artist: 'AuraTune Studio', artistId: 'auratune-studio', album: 'Lofi bên cửa sổ', albumId: 'al-lofi-cua-so', genre: 'lofi', duration: '2:58', added: 'Hôm nay', cover: 'night', plays: '18 N', playCount: 18000, releaseDate: '2026-09-20', lyrics: rainyLyrics },
  { id: 't10', title: 'Slow Afternoon', artist: 'AuraTune Studio', artistId: 'auratune-studio', album: 'Deep Focus', albumId: 'al-deep-focus', genre: 'chill', duration: '4:12', added: 'Hôm nay', cover: 'forest', plays: '21 N', playCount: 21000, releaseDate: '2026-10-10', lyrics: afternoonLyrics },
]

export const playlists = [
  {
    id: 'aura-mix',
    title: 'Aura Mix hôm nay',
    description: 'Một chút dịu dàng, một chút bất ngờ — dành riêng cho nhịp điệu của bạn.',
    owner: 'AuraTune',
    official: true,
    trackIds: ['t1', 't2', 't3', 't4', 't5', 't6', 't7'],
    count: 24,
    duration: '1 giờ 32 phút',
    cover: 'aurora',
    label: 'MIX CỦA BẠN',
    updatedAt: '2026-10-28',
  },
  {
    id: 'dem-thanh-pho',
    title: 'Đêm thành phố',
    description: 'Những thanh âm mềm mại cho một đêm thật dài.',
    owner: 'Minh Anh',
    official: false,
    trackIds: ['t2', 't5', 't9', 't1'],
    count: 18,
    duration: '58 phút',
    cover: 'night',
    label: 'PLAYLIST',
    updatedAt: '2026-10-20',
  },
  {
    id: 'lofi-chill',
    title: 'Lofi bên cửa sổ',
    description: 'Nhịp beat chậm rãi để tập trung, đọc sách và thở sâu.',
    owner: 'AuraTune',
    official: true,
    trackIds: ['t8', 't9', 't10'],
    count: 32,
    duration: '2 giờ 04 phút',
    cover: 'ocean',
    label: 'TUYỂN TẬP',
    updatedAt: '2026-10-25',
  },
  {
    id: 'indie-viet',
    title: 'Indie Việt dịu êm',
    description: 'Những câu chuyện nhỏ được kể bằng giai điệu lớn.',
    owner: 'AuraTune',
    official: true,
    trackIds: ['t1', 't3', 't5', 't7', 't6', 't2'],
    count: 27,
    duration: '1 giờ 46 phút',
    cover: 'rose',
    label: 'NỔI BẬT',
    updatedAt: '2026-10-22',
  },
  {
    id: 'nang-len',
    title: 'Nắng lên rồi',
    description: 'Bật mood tích cực, bắt đầu ngày mới theo cách của bạn.',
    owner: 'Linh Nguyễn',
    official: false,
    trackIds: ['t4', 't3', 't7', 't6'],
    count: 21,
    duration: '1 giờ 11 phút',
    cover: 'sunset',
    label: 'PLAYLIST',
    updatedAt: '2026-10-18',
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    description: 'Không gian âm thanh tối giản cho những giờ tập trung.',
    owner: 'AuraTune',
    official: true,
    trackIds: ['t10', 't9', 't8'],
    count: 40,
    duration: '2 giờ 48 phút',
    cover: 'forest',
    label: 'TẬP TRUNG',
    updatedAt: '2026-10-26',
  },
]

export const featuredTrack = tracks[0]

export const recentlyPlayed = [
  { ...playlists[1], title: 'Đêm thành phố' },
  { ...playlists[2], title: 'Lofi bên cửa sổ' },
  { ...playlists[3], title: 'Indie Việt dịu êm' },
]

export const getPlaylist = (id) => playlists.find((playlist) => playlist.id === id) ?? playlists[0]
export const findPlaylist = (id) => playlists.find((playlist) => playlist.id === id) ?? null
export const getTrack = (id) => tracks.find((track) => track.id === id) ?? null
export const getArtist = (id) => artists.find((artist) => artist.id === id) ?? null
export const getAlbum = (id) => albums.find((album) => album.id === id) ?? null
export const getGenre = (id) => genres.find((genre) => genre.id === id) ?? null

export const getPlaylistTracks = (id) => (findPlaylist(id)?.trackIds ?? []).map(getTrack).filter(Boolean)
