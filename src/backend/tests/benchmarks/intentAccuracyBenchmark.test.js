import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';
import { INTENT_TYPES } from '../../constants/intentConstants.js';

describe('intentAccuracyBenchmark (T037 - 50+ Case Intent Accuracy Benchmark - SC-001 >= 90%)', () => {
  const benchmarkDataset = [
    // 1. play_music (15 cases)
    { prompt: 'bật bài Chúng ta của hiện tại của Sơn Tùng M-TP', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'phát bài Nơi này có anh', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'mở nhạc Đen Vâu', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'nghe bài Cắt đôi nỗi sầu', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'tạm dừng nhạc', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'dừng lại', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'tiếp tục phát', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'chuyển bài tiếp theo', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'quay lại bài trước', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'cho âm lượng 70%', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'tăng âm lượng', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'giảm âm lượng', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'bật nhạc lên', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'mở nhạc đi', expectedIntent: INTENT_TYPES.PLAY_MUSIC },
    { prompt: 'phát nhạc chill', expectedIntent: INTENT_TYPES.PLAY_MUSIC },

    // 2. search_music (12 cases)
    { prompt: 'tìm cho mình mấy bài chill để học bài đêm khuya', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'gợi ý các bài hát pop sôi động', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'tìm bài hát có lời là "dù cho mai về sau"', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'tìm album 25 của Adele', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'tìm kiếm bài hát Nắng ấm xa dần', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'muốn nghe nhạc acoustic thư giãn', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'gợi ý nhạc rap việt hay nhất', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'tìm nhạc để tập gym', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'nhạc buồn tâm trạng', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'gợi ý bài hát đi ngủ', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'kiếm bài hát ballad nhẹ nhàng', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },
    { prompt: 'tìm nhạc lofi tập trung làm việc', expectedIntent: INTENT_TYPES.SEARCH_MUSIC },

    // 3. query_music_info (8 cases)
    { prompt: 'bài đang phát là gì thế?', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },
    { prompt: 'đây là bài gì vậy?', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },
    { prompt: 'ai đang hát bài này?', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },
    { prompt: 'tên bài hát là gì?', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },
    { prompt: 'ca sĩ này là ai?', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },
    { prompt: 'thông tin bài hát này', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },
    { prompt: 'bài này tên gì', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },
    { prompt: 'ai hát bài đang nghe', expectedIntent: INTENT_TYPES.QUERY_MUSIC_INFO },

    // 4. manage_library (8 cases)
    { prompt: 'lưu bài này vào danh sách phát yêu thích', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },
    { prompt: 'thêm vào playlist', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },
    { prompt: 'thích bài này', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },
    { prompt: 'yêu thích bài này', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },
    { prompt: 'lưu vào thư viện', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },
    { prompt: 'tạo playlist mới', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },
    { prompt: 'xóa khỏi playlist', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },
    { prompt: 'thả tim bài này', expectedIntent: INTENT_TYPES.MANAGE_LIBRARY },

    // 5. general_chitchat (8 cases)
    { prompt: 'hôm nay thời tiết thế nào bạn ơi?', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
    { prompt: 'chào bạn', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
    { prompt: 'hello bot', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
    { prompt: 'bạn là ai thế?', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
    { prompt: 'hôm nay ăn gì nhỉ?', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
    { prompt: 'bây giờ là mấy giờ rồi?', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
    { prompt: 'kể cho mình nghe một câu chuyện đi', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
    { prompt: 'tâm sự một chút được không?', expectedIntent: INTENT_TYPES.GENERAL_CHITCHAT },
  ];

  test(`asserts classification accuracy >= 90% across ${benchmarkDataset.length} diverse queries`, async () => {
    let correct = 0;
    const failures = [];

    const mockContext = {
      currentTrack: { id: 'track-01', title: 'Nắng Ấm Xa Dần', artist: 'Sơn Tùng M-TP' },
      isPlaying: true,
      volume: 65,
    };

    for (const item of benchmarkDataset) {
      const result = await analyzeIntent(item.prompt, mockContext);
      if (result.intentType === item.expectedIntent) {
        correct++;
      } else {
        failures.push({
          prompt: item.prompt,
          expected: item.expectedIntent,
          actual: result.intentType,
        });
      }
    }

    const accuracy = (correct / benchmarkDataset.length) * 100;
    if (failures.length > 0) {
      console.log('Benchmark misclassifications:', failures);
    }

    console.log(`\n🎯 Intent Classification Benchmark: ${correct}/${benchmarkDataset.length} (${accuracy.toFixed(1)}%)`);
    assert.ok(
      accuracy >= 90.0,
      `Expected accuracy >= 90%, achieved ${accuracy.toFixed(1)}%`
    );
  });
});
