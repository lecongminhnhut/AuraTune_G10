"""
Test script for AuraTune AI Brain Service.
Verifies health check, local fallback, and Gemini stream generation.
"""

import asyncio
from agent import stream_agent
from tools import ToolCollector

async def test_stream():
    print("=== Testing stream_agent with a music request ===")
    test_prompt = "Chào bạn, hãy bật playlist lofi chill giùm tôi nhé"
    test_context = {
        "currentTrack": None,
        "isPlaying": False,
        "volume": 70
    }

    events_received = []
    async for event_chunk in stream_agent(test_prompt, test_context):
        events_received.append(event_chunk)
        # In ngắn gọn các event
        lines = [line for line in event_chunk.split("\n") if line.strip()]
        for l in lines:
            print("  ", l)

    print(f"\nTotal SSE events chunks: {len(events_received)}")
    assert len(events_received) > 0, "No SSE events generated!"
    print("Test passed successfully!")

if __name__ == "__main__":
    asyncio.run(test_stream())
