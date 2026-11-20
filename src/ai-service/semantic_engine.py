"""Self-hosted semantic search engine with optional MiniLM and Chroma acceleration."""

import re
import unicodedata
import os
from typing import Any

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

try:
    import chromadb
except ImportError:
    chromadb = None

WEIGHTS = {"metadata": 0.3, "lyrics": 0.4, "audio": 0.3}
AUDIO_FIELDS = ["tempo", "bpm", "key", "mode", "energy", "valence", "danceability", "acousticness", "instrumentalness", "speechiness", "loudness", "liveness", "time_signature", "duration"]

def normalize(value: Any) -> str:
    text = unicodedata.normalize("NFD", str(value or ""))
    return re.sub(r"\s+", " ", "".join(c for c in text if unicodedata.category(c) != "Mn").lower()).strip()

def token_similarity(query: str, value: str) -> float:
    left, right = set(normalize(query).split()), set(normalize(value).split())
    return len(left & right) / len(left | right) if left and right else 0.0

def combine_dimensions(dimensions: dict[str, float | None]) -> float:
    available = [(key, value) for key, value in dimensions.items() if value is not None]
    if not available:
        return 0.0
    total = sum(WEIGHTS[key] for key, _ in available)
    return sum(value * WEIGHTS[key] / total for key, value in available)

class SemanticEngine:
    def __init__(self) -> None:
        try:
            self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2") if SentenceTransformer else None
        except Exception:
            self.model = None
        try:
            self.client = chromadb.PersistentClient(path="src/ai-service/.chroma") if chromadb else None
        except Exception:
            self.client = None

    def search(self, query: str, catalog: list[dict[str, Any]], limit: int, offset: int) -> list[dict[str, Any]]:
        results = []
        for row in catalog:
            metadata = " ".join(str(row.get(key) or "") for key in ("title", "genre", "album", "artist"))
            lyrics = row.get("lyrics")
            dimensions = {"metadata": token_similarity(query, metadata), "lyrics": token_similarity(query, lyrics) if lyrics else None, "audio": None}
            score = combine_dimensions(dimensions)
            if score > 0:
                results.append({"id": str(row["song_id"]), "score": score, "ai_reason": None})
        results.sort(key=lambda item: (-item["score"], item["id"]))
        return results[offset:offset + limit]
