
import csv
import re
from pathlib import Path
from urllib.parse import unquote

SOURCE = Path("src/database/seeds/license-records.csv")
OUTPUT = Path("src/database/seeds/license-records-reviewed.csv")

# Mapping nghệ sĩ -> album dự kiến từ nguồn FMA.
# Cần xác minh từng track thuộc đúng album trước khi seed.
ALBUMS = {
    "HoliznaCC0": "Lo-fi And Chill",
    "John Bartmann": "Public Domain Soundtrack Music: Album One",
    "Soft and Furious": "The Man I'm Not",
}

# Hậu tố giống timestamp trong tên file tải về.
TIMESTAMP = re.compile(r"\s+\d{2}\.\d{2}\.\d{2}$")


def parse_filename(filename):
    name = unquote(Path(filename).name)

    # Xử lý các file có đuôi .mp3.mp3
    while name.lower().endswith(".mp3"):
        name = name[:-4]

    # Tách nghệ sĩ và tên bài
    if " - " not in name:
        return None, None

    artist, title = name.split(" - ", 1)

    # Loại bỏ timestamp ở cuối, kể cả khi lặp
    while TIMESTAMP.search(title):
        title = TIMESTAMP.sub("", title)

    return artist.strip(), title.strip()


def main():
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)

    with SOURCE.open(
        "r", encoding="utf-8-sig", newline=""
    ) as file:
        reader = csv.DictReader(file)
        fields = reader.fieldnames
        rows = list(reader)

    if not fields:
        raise ValueError("CSV has no headers")

    required = ["title", "artist", "album", "local_filename"]

    for field in required:
        if field not in fields:
            raise ValueError(f"Missing column: {field}")

    updated = 0

    for row in rows:
        filename = row["local_filename"]
        artist, title = parse_filename(filename)

        if not artist or not title:
            print(f"REVIEW REQUIRED: {filename}")
            continue

        row["artist"] = artist
        row["title"] = title

        # Điền album dự kiến nếu trước đó chưa có.
        if not row["album"].strip():
            row["album"] = ALBUMS.get(artist, "")

        updated += 1
        print(f"OK: {artist} - {title}")

    with OUTPUT.open(
        "w", encoding="utf-8-sig", newline=""
    ) as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print()
    print(f"Processed: {updated}/{len(rows)} songs")
    print(f"Output: {OUTPUT}")
    print("Verify album names and licenses before seeding.")


if __name__ == "__main__":
    main()
