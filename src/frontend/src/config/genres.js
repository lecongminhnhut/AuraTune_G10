// Owner-approved application taxonomy. Legacy database text is not rewritten.
export const genres = [
  { id: 'vpop', name: 'V-Pop', cover: 'rose', description: 'Những bản hit Việt được nghe nhiều nhất.' },
  { id: 'indie', name: 'Indie Việt', cover: 'night', description: 'Giai điệu mộc, lời ca nhiều câu chuyện.' },
  { id: 'rnb', name: 'R&B / Soul', cover: 'violet', description: 'Mềm mại, tình cảm và đầy groove.' },
  { id: 'lofi', name: 'Lofi', cover: 'ocean', description: 'Beat chậm, ít lời, hợp để tập trung.' },
  { id: 'ballad', name: 'Ballad', cover: 'sunset', description: 'Những bản tình ca nhẹ nhàng.' },
  { id: 'chill', name: 'Chill / Focus', cover: 'forest', description: 'Âm thanh tối giản cho giờ làm việc.' },
];
export const genreName=id=>genres.find(genre=>genre.id===id)?.name ?? id ?? 'Chưa có thể loại';
