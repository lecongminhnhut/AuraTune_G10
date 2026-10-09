export const playlists = [
  {
    id: 'aura-mix',
    title: 'Aura Mix Today',
    description: 'A little warmth, a little surprise — selected for your rhythm.',
    owner: 'AuraTune',
    count: 24,
    duration: '1 hr 32 min',
    cover: 'aurora',
    label: 'YOUR MIX',
  },
  {
    id: 'dem-thanh-pho',
    title: 'City Nights',
    description: 'Soft sounds for a long night.',
    owner: 'Minh Anh',
    count: 18,
    duration: '58 min',
    cover: 'night',
    label: 'PLAYLIST',
  },
  {
    id: 'lofi-chill',
    title: 'Lofi by the Window',
    description: 'Slow beats for focus, reading and a deep breath.',
    owner: 'AuraTune',
    count: 32,
    duration: '2 hr 04 min',
    cover: 'ocean',
    label: 'COLLECTION',
  },
  {
    id: 'indie-viet',
    title: 'Mellow Vietnamese Indie',
    description: 'Small stories told through big melodies.',
    owner: 'AuraTune',
    count: 27,
    duration: '1 hr 46 min',
    cover: 'rose',
    label: 'FEATURED',
  },
  {
    id: 'nang-len',
    title: 'Here Comes the Sun',
    description: 'Lift your mood and start the day your way.',
    owner: 'Linh Nguyễn',
    count: 21,
    duration: '1 hr 11 min',
    cover: 'sunset',
    label: 'PLAYLIST',
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    description: 'A minimal soundscape for focused hours.',
    owner: 'AuraTune',
    count: 40,
    duration: '2 hr 48 min',
    cover: 'forest',
    label: 'FOCUS',
  },
]

export const tracks = [
  { id: 't1', title: 'Nàng thơ', artist: 'Hoàng Dũng', album: '25', duration: '4:21', added: '2 days ago', cover: 'rose', plays: '1.2M' },
  { id: 't2', title: 'Bước qua mùa cô đơn', artist: 'Vũ.', album: 'Một vạn năm', duration: '4:08', added: 'Yesterday', cover: 'night', plays: '986K' },
  { id: 't3', title: 'Có em', artist: 'Madihu, Low G', album: 'Có em', duration: '3:44', added: 'Yesterday', cover: 'sunset', plays: '842K' },
  { id: 't4', title: 'Thích em hơi nhiều', artist: 'Wren Evans', album: 'Loi Choi', duration: '3:12', added: '1 week ago', cover: 'violet', plays: '765K' },
  { id: 't5', title: 'Chuyện rằng', artist: 'Thịnh Suy', album: 'Chuyện rằng', duration: '4:13', added: '1 week ago', cover: 'ocean', plays: '652K' },
  { id: 't6', title: 'Tình đắng như ly cà phê', artist: '大木, Nân', album: 'Tình đắng', duration: '3:37', added: '2 weeks ago', cover: 'forest', plays: '601K' },
  { id: 't7', title: '3107', artist: 'W/n, Duongg, Nâu', album: '3107', duration: '3:42', added: '2 weeks ago', cover: 'aurora', plays: '588K' },
]

export const featuredTrack = tracks[0]

export const recentlyPlayed = [
  { ...playlists[1], title: 'City Nights' },
  { ...playlists[2], title: 'Lofi by the Window' },
  { ...playlists[3], title: 'Mellow Vietnamese Indie' },
]

export const getPlaylist = (id) => playlists.find((playlist) => playlist.id === id) ?? playlists[0]
