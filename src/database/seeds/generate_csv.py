
import csv
from pathlib import Path
from mutagen.easyid3 import EasyID3
from mutagen.mp3 import MP3

# Thư mục lưu các file MP3 đã tải
AUDIO_DIR = Path.home() / "Documents/AuraTune/seed-media/audio"

# File CSV được tạo tự động
OUTPUT = Path("src/database/seeds/license-records.csv")

FIELDS = [
    "title",
    "artist",
    "album",
    "genre",
    "duration",
    "source_url",
    "license",
    "license_url",
    "attribution",
    "local_filename",
    "cloudinary_url",
]


def first_tag(tags, key):
    return tags.get(key, [""])[0].strip()


def read_mp3(file_path):
    audio = MP3(file_path)
    duration = round(audio.info.length)

    try:
        tags = EasyID3(file_path)
    except Exception:
        tags = {}

    return {
        "title": first_tag(tags, "title") or file_path.stem,
        "artist": first_tag(tags, "artist"),
        "album": first_tag(tags, "album"),
        "genre": first_tag(tags, "genre"),
        "duration": duration,
        "source_url": "",
        "license": "",
        "license_url": "",
        "attribution": "",
        "local_filename": file_path.name,
        "cloudinary_url": "",
    }


def main():
    files = sorted(AUDIO_DIR.glob("*.mp3"))

    if not files:
        print("No MP3 files found:", AUDIO_DIR)
        return

    if OUTPUT.exists():
        print("CSV already exists. No file was overwritten:", OUTPUT)
        return

    rows = []

    for file_path in files:
        try:
            rows.append(read_mp3(file_path))
            print("OK:", file_path.name)
        except Exception as error:
            print("ERROR:", file_path.name, error)

    if not rows:
        print("No valid MP3 metadata found.")
        return

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    print()
    print("CSV created:", OUTPUT)
    print("Songs:", len(rows))

    missing = sum(
        1 for row in rows
        if not row["artist"] or not row["album"]
    )
    print("Songs missing artist or album:", missing)
    print("Source and license fields require verification.")


if __name__ == "__main__":
    main()
