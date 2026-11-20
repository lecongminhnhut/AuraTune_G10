
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import { supabase } from '../../database/supabaseClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CSV_PATH = path.resolve(
  __dirname,
  '../../database/seeds/license-records-uploaded.csv'
);

const APPLY = process.argv.includes('--apply');

function requireValue(row, key, index) {
  const value = String(row[key] ?? '').trim();
  if (!value) {
    throw new Error(`Row ${index}: missing ${key}`);
  }
  return value;
}

async function findExisting(table, filters, idColumn) {
  let query = supabase.from(table).select('*');

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query.limit(2);

  if (error) throw error;

  if (data.length > 1) {
    throw new Error(`Ambiguous existing records in ${table}`);
  }

  return data[0] ?? null;
}

async function insertOne(table, values) {
  const { data, error } = await supabase
    .from(table)
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function main() {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const content = await fs.readFile(CSV_PATH, 'utf8');

  const rows = parse(content.replace(/^\uFEFF/, ''), {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  if (!rows.length) {
    throw new Error('CSV is empty');
  }

  const prepared = rows.map((row, index) => {
    const title = requireValue(row, 'title', index + 1);
    const artist = requireValue(row, 'artist', index + 1);
    const album = requireValue(row, 'album', index + 1);
    const audioUrl = requireValue(
      row, 'cloudinary_url', index + 1
    );

    const sourceUrl = requireValue(
      row, 'source_url', index + 1
    );

    const license = requireValue(
      row, 'license', index + 1
    );

    const licenseUrl = requireValue(
      row, 'license_url', index + 1
    );

    const url = new URL(audioUrl);

    if (
      url.protocol !== 'https:' ||
      url.hostname !==
        'res.cloudinary.com' ||
      !url.pathname.startsWith('/ihtfjdsc/video/upload/')
    ) {
      throw new Error(
        `Row ${index + 1}: unexpected Cloudinary URL`
      );
    }

    for (const value of [sourceUrl, licenseUrl]) {
      if (!value.startsWith('https://')) {
        throw new Error(
          `Row ${index + 1}: invalid source/license URL`
        );
      }
    }

    if (!['CC0 1.0', 'CC BY 4.0'].includes(license)) {
      throw new Error(
        `Row ${index + 1}: review license ${license}`
      );
    }

    if (
      license === 'CC BY 4.0' &&
      !String(row.attribution ?? '').trim()
    ) {
      throw new Error(
        `Row ${index + 1}: missing attribution`
      );
    }

    const duration = Number(row.duration);

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(
        `Row ${index + 1}: invalid duration`
      );
    }

    return {
      title,
      artist,
      album,
      audio_url: audioUrl,
      duration: Math.round(duration),
      genre: String(row.genre ?? '').trim() || null
    };
  });

  const artists = new Set(prepared.map(r => r.artist));
  const albums = new Set(
    prepared.map(r => `${r.artist}::${r.album}`)
  );

  const songKeys = prepared.map(
    r => `${r.artist}::${r.album}::${r.title}`
  );

  if (new Set(songKeys).size !== songKeys.length) {
    throw new Error('Duplicate songs detected in CSV');
  }

  console.log('========== SEED PREVIEW ==========');
  console.log('Artists:', artists.size);
  console.log('Albums:', albums.size);
  console.log('Songs:', prepared.length);
  console.log('Mode:', APPLY ? 'WRITE' : 'DRY RUN');

  if (!APPLY) {
    console.log('\nNo database changes made.');
    console.log('Review album and license metadata first.');
    console.log('Run with --apply to insert.');
    return;
  }

  const artistIds = new Map();
  const albumIds = new Map();

  let newArtists = 0;
  let newAlbums = 0;
  let newSongs = 0;
  let skippedSongs = 0;

  // Stage 1: Artists
  for (const name of artists) {
    let artist = await findExisting(
      'artists', { name }, 'artist_id'
    );

    if (!artist) {
      artist = await insertOne('artists', {
        name,
        user_id: null
      });
      newArtists++;
    }

    artistIds.set(name, artist.artist_id);
    console.log('ARTIST:', name, artist.artist_id);
  }

  // Stage 2: Albums
  for (const row of prepared) {
    const key = `${row.artist}::${row.album}`;

    if (albumIds.has(key)) continue;

    const artistId = artistIds.get(row.artist);

    let album = await findExisting('albums', {
      title: row.album,
      artist_id: artistId
    }, 'album_id');

    if (!album) {
      album = await insertOne('albums', {
        title: row.album,
        artist_id: artistId
      });
      newAlbums++;
    }

    albumIds.set(key, album.album_id);
    console.log('ALBUM:', row.album, album.album_id);
  }

  // Stage 3: Songs
  for (const row of prepared) {
    const albumId = albumIds.get(
      `${row.artist}::${row.album}`
    );

    const existing = await findExisting('songs', {
      title: row.title,
      album_id: albumId
    }, 'song_id');

    if (existing) {
      if (existing.audio_url !== row.audio_url) {
        throw new Error(
          `Existing song has different audio URL: ${row.title}`
        );
      }

      skippedSongs++;
      console.log('SKIP:', row.title);
      continue;
    }

    await insertOne('songs', {
      title: row.title,
      album_id: albumId,
      audio_url: row.audio_url,
      duration: row.duration,
      genre: row.genre,
      total_plays: 0
    });

    newSongs++;
    console.log('INSERT:', row.title);
  }

  console.log('\n========== SEED SUMMARY ==========');
  console.log('New artists:', newArtists);
  console.log('New albums:', newAlbums);
  console.log('New songs:', newSongs);
  console.log('Existing songs:', skippedSongs);
  console.log('Completed.');
}

main().catch(error => {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
});
