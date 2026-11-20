import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeIntent } from '../../services/intentUnderstandingService.js';

describe('intentLatencyBenchmark (T038 - Intent Processing Latency Benchmark - SC-002 < 1200ms)', () => {
  const samplePrompts = [
    'bật bài Chúng ta của hiện tại của Sơn Tùng M-TP',
    'phát nhạc chill rồi giảm âm lượng 40%',
    'tìm cho mình mấy bài chill để học bài đêm khuya',
    'bài đang phát là gì thế?',
    'hôm nay thời tiết thế nào bạn ơi?',
    'Tôi là Nam, email nam99@gmail.com, số điện thoại 0912345678, hãy bật nhạc Trịnh',
    'bật bài Nơi này có anh, sau đó chuyển bài',
    'giảm âm lượng',
    'to lên',
    'mở nhạc đi',
  ];

  const mockContext = {
    currentTrack: { id: 'song-demo-1', title: 'Ánh Nắng Của Anh', artist: 'Đức Phúc' },
    isPlaying: true,
    volume: 60,
  };

  test('verifies all intent evaluations finish well within 1,200ms limit (SC-002)', async () => {
    const latencies = [];

    // Run 20 iterations across various prompt patterns
    for (let i = 0; i < 20; i++) {
      const prompt = samplePrompts[i % samplePrompts.length];
      const start = performance.now();
      const result = await analyzeIntent(prompt, mockContext);
      const elapsed = performance.now() - start;

      assert.ok(result);
      assert.ok(elapsed < 1200, `Evaluation took ${elapsed}ms, exceeding 1,200ms threshold`);
      latencies.push(elapsed);
    }

    const maxLatency = Math.max(...latencies);
    const avgLatency = latencies.reduce((sum, v) => sum + v, 0) / latencies.length;

    console.log(
      `\n⚡ Latency Benchmark: Avg = ${avgLatency.toFixed(2)}ms, Max = ${maxLatency.toFixed(2)}ms (Limit: 1200ms)`
    );

    assert.ok(maxLatency < 1200, `Max latency was ${maxLatency}ms`);
  });
});
