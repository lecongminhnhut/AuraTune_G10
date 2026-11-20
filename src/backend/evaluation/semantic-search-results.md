# Semantic Search Evaluation Results

## Automated validation

- Backend semantic ranking, privacy, fallback, and route tests: passed.
- Frontend semantic query and adapter tests: passed.
- Full frontend test suite: passed.
- Production build: blocked by the existing Windows/esbuild path-access environment error; no source diagnostic was reported.

## Measurement plan

For production acceptance, capture only aggregate measurements: initial-result latency, 1,500 ms fallback rate, AI 429/503 rate, invalid-response rate, duplicate-result rate, and human relevance at scores 4–5. Do not capture raw queries, profile values, email addresses, or AI payloads.
