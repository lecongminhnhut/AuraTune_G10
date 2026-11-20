
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import cloudinary from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dirname, '../../..');
const SEED_DIR = path.join(ROOT, 'src/database/seeds');

const INPUT = path.join(
  SEED_DIR,
  'license-records-reviewed.csv'
);

const OUTPUT = path.join(
  SEED_DIR,
  'license-records-uploaded.csv'
);

const AUDIO_DIR = path.join(
  process.env.HOME,
  'Documents/AuraTune/seed-media/audio'
);

const MAX_SIZE = 50 * 1024 * 1024;
const DRY_RUN = process.argv.includes('--dry-run');

const REQUIRED = [
  'title',
  'artist',
  'album',
  'local_filename',
  'source_url',
  'license',
  'license_url'
];

function isApprovedLicense(row) {
  const license = row.license.trim().toUpperCase();
  const url = row.license_url.trim();

  const isCC0 =
    /^CC0(?:\s+1\.0)?$/.test(license) &&
    url.startsWith(
      'https://creativecommons.org/publicdomain/zero/1.0'
    );

  const isCCBY =
    /^CC BY(?:\s+4\.0)?$/.test(license) &&
    url.startsWith(
      'https://creativecommons.org/licenses/by/4.0'
    ) &&
    Boolean(row.attribution?.trim());

  return isCC0 || isCCBY;
}

async function saveCSV(rows, columns) {
  const csv = stringify(rows, {
    header: true,
    columns
  });

  const temporary = OUTPUT + '.tmp';

  await fs.writeFile(temporary, csv, 'utf8');
  await fs.rename(temporary, OUTPUT);
}

async function main() {
  const csvPath = await fs.access(OUTPUT)
    .then(() => OUTPUT)
    .catch(() => INPUT);

  const content = await fs.readFile(csvPath, 'utf8');

  const rows = parse(content.replace(/^\uFEFF/, ''), {
    columns: true,
    skip_empty_lines: true
  });

  if (rows.length === 0) {
    throw new Error('CSV has no songs');
  }

  for (const column of REQUIRED) {
    if (!(column in rows[0])) {
      throw new Error(`Missing CSV column: ${column}`);
    }
  }

  const columns = [
    ...Object.keys(rows[0]),
    'public_id'
  ].filter((column, index, all) =>
    all.indexOf(column) === index
  );

  if (!columns.includes('cloudinary_url')) {
    columns.push('cloudinary_url');
  }

  const filenames = new Set();
  let invalid = 0;

  // Validate before uploading anything.
  for (const row of rows) {
    const filename = row.local_filename?.trim();

    try {
      if (!filename || path.basename(filename) !== filename) {
        throw new Error('Invalid filename');
      }

      if (filenames.has(filename)) {
        throw new Error('Duplicate filename');
      }
      filenames.add(filename);

      const audioPath = path.join(AUDIO_DIR, filename);
      const stats = await fs.stat(audioPath);

      if (!stats.isFile() || !filename.toLowerCase().endsWith('.mp3')) {
        throw new Error('Not an MP3 file');
      }

      if (stats.size > MAX_SIZE || stats.size === 0) {
        throw new Error('Invalid size (max 50 MiB)');
      }

      if (!row.title?.trim() || !row.artist?.trim()) {
        throw new Error('Missing title or artist');
      }

      // Licensing must be checked against the original track page.
      if (!row.source_url?.startsWith('https://')) {
        throw new Error('Missing HTTPS source URL');
      }

      if (!isApprovedLicense(row)) {
        throw new Error('Unverified or unsupported license metadata');
      }

      console.log(`READY: ${row.artist} - ${row.title}`);
    } catch (error) {
      invalid++;
      console.error(`INVALID: ${filename}: ${error.message}`);
    }
  }

  console.log(`\nTotal: ${rows.length}, invalid: ${invalid}`);

  if (invalid > 0) {
    throw new Error('Fix CSV or files before uploading');
  }

  if (DRY_RUN) {
    console.log('Dry run passed. No files uploaded.');
    return;
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary configuration is missing');
  }

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const [index, row] of rows.entries()) {
    const filename = row.local_filename;
    const audioPath = path.join(AUDIO_DIR, filename);

    if (row.cloudinary_url?.trim()) {
      skipped++;
      console.log(`SKIP: ${filename}`);
      continue;
    }

    console.log(`\n[${index + 1}/${rows.length}] Uploading ${filename}`);

    try {
      const result = await cloudinary.uploader.upload(audioPath, {
        resource_type: 'video',
        folder: 'auratune/audio',
        unique_filename: true,
        overwrite: false
      });

      row.cloudinary_url = result.secure_url;
      row.public_id = result.public_id;

      // Save progress after every successful upload.
      await saveCSV(rows, columns);

      success++;
      console.log(`SUCCESS: ${row.title}`);
      console.log(`URL: ${result.secure_url}`);
    } catch (error) {
      failed++;
      console.error(`FAILED: ${filename}`);
      console.error(error.message ?? error);
    }
  }

  // Also create output if every row was previously uploaded.
  await saveCSV(rows, columns);

  console.log('\n========== SUMMARY ==========');
  console.log('Total:', rows.length);
  console.log('Uploaded now:', success);
  console.log('Already uploaded:', skipped);
  console.log('Failed:', failed);
  console.log('CSV:', OUTPUT);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Bulk upload stopped:', error.message);
  process.exitCode = 1;
});
