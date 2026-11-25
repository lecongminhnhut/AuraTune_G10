import sys
from pathlib import Path

# The service modules (main.py, playlist_generator.py, ...) live one level up and are imported by name.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
