
import csv
import shutil
from pathlib import Path

CSV_FILE = Path("src/database/seeds/license-records-reviewed.csv")

ALBUM_SOURCES = {
    "HoliznaCC0": (
        "https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill"
    ),
    "John Bartmann": (
        "https://freemusicarchive.org/music/John_Bartmann/Public_Domain_Soundtrack_Music_Album_One/"
    ),
    "Soft and Furious": (
        "https://freemusicarchive.org/music/Soft_and_Furious/The_Man_Im_Not"
    ),
}

LICENSE_URL = "https://creativecommons.org/publicdomain/zero/1.0/"

def main():
    if not CSV_FILE.exists():
        raise FileNotFoundError(CSV_FILE)

    backup = CSV_FILE.with_suffix(".csv.bak")
    shutil.copy2(CSV_FILE, backup)

    with CSV_FILE.open(encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        fields = reader.fieldnames
        rows = list(reader)

    required = ["artist", "title", "source_url", "license",
                "license_url", "attribution"]

    if not fields or any(field not in fields for field in required):
        raise ValueError("CSV is missing required columns")

    updated = 0

    for row in rows:
        artist = row["artist"].strip()

        if artist not in ALBUM_SOURCES:
            print("REVIEW:", row["title"], "- Unknown artist")
            continue

        # These values come from the FMA album page.
        # Verify individual track licensing before upload.
        row["source_url"] = (
            row["source_url"].strip() or ALBUM_SOURCES[artist]
        )
        row["license"] = row["license"].strip() or "CC0 1.0"
        row["license_url"] = (
            row["license_url"].strip() or LICENSE_URL
        )
        row["attribution"] = row["attribution"].strip() or (
            f'{row["title"]} by {artist} — '
            f'Free Music Archive — {row["source_url"]}'
        )

        updated += 1
        print(f"UPDATED: {artist} - {row['title']}")

    with CSV_FILE.open(
        "w", encoding="utf-8-sig", newline=""
    ) as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nUpdated: {updated}/{len(rows)}")
    print("Backup:", backup)
    print("IMPORTANT: Track licenses still need verification.")

if __name__ == "__main__":
    main()
