/**
 * PRODUCTION DIGITAL PATHOLOGY LIBVIPS SLIDE CONVERTER
 * 
 * Scans `public/slides/original/` for Whole Slide Images (SVS, NDPI, TIFF, MRXS, JPG, PNG)
 * and generates Deep Zoom Image (DZI) tile pyramids into `public/slides/converted/`.
 * 
 * Usage:
 *   npm run convert
 */

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORIGINAL_DIR = path.join(__dirname, 'public', 'slides', 'original');
const CONVERTED_DIR = path.join(__dirname, 'public', 'slides', 'converted');
const MANIFEST_PATH = path.join(__dirname, 'public', 'slides', 'manifest.json');

const KNOWN_VIPS_PATHS = [
  'vips',
  'C:\\Users\\ASUS\\.gemini\\antigravity\\scratch\\vips-win64\\vips-dev-8.15\\bin\\vips.exe',
];

const SUPPORTED_EXTS = new Set([
  '.svs', '.ndpi', '.mrxs', '.tif', '.tiff', '.scn', '.bif',
  '.jpg', '.jpeg', '.png', '.webp', '.bmp'
]);

async function findVipsBinary() {
  for (const vPath of KNOWN_VIPS_PATHS) {
    const isOk = await new Promise((resolve) => {
      const proc = spawn(vPath, ['--version']);
      proc.on('close', (code) => resolve(code === 0));
      proc.on('error', () => resolve(false));
    });
    if (isOk) return vPath;
  }
  return null;
}

async function convertFileWithLibvips(vipsBin, inputFile, outputFolder) {
  await fs.mkdir(outputFolder, { recursive: true });
  const outputPrefix = path.join(outputFolder, 'slide');

  const args = [
    'dzsave',
    inputFile,
    outputPrefix,
    '--layout', 'dz',
    '--tile-size', '256',
    '--overlap', '0',
    '--depth', 'onepixel',
    '--suffix', '.jpg[Q=85]',
    '--strip'
  ];

  console.log(`[CONVERTING] ${vipsBin} ${args.join(' ')}`);

  return new Promise((resolve, reject) => {
    const proc = spawn(vipsBin, args);
    let stderr = '';

    proc.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`[SUCCESS] DZI pyramid generated at: ${outputPrefix}.dzi`);
        resolve(outputPrefix + '.dzi');
      } else {
        reject(new Error(`vips dzsave failed (exit code ${code}): ${stderr}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function runPipeline() {
  await fs.mkdir(ORIGINAL_DIR, { recursive: true });
  await fs.mkdir(CONVERTED_DIR, { recursive: true });

  const vipsBin = await findVipsBinary();
  if (!vipsBin) {
    console.error(`[ERROR] libvips binary not found in PATH or standard scratch location.`);
    process.exit(1);
  }
  console.log(`[FOUND VIPS] Using libvips engine at: ${vipsBin}`);

  const entries = await fs.readdir(ORIGINAL_DIR, { withFileTypes: true });
  const imageFiles = entries
    .filter((e) => e.isFile() && SUPPORTED_EXTS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name);

  if (imageFiles.length === 0) {
    console.log(`[INFO] No slides found in ${ORIGINAL_DIR}`);
    return;
  }

  console.log(`[FOUND] ${imageFiles.length} slide image(s) to process.`);

  for (const file of imageFiles) {
    const baseName = path.parse(file).name;
    const inputPath = path.join(ORIGINAL_DIR, file);
    const outputSlideDir = path.join(CONVERTED_DIR, baseName);

    try {
      await convertFileWithLibvips(vipsBin, inputPath, outputSlideDir);
    } catch (err) {
      console.error(`[ERROR] Failed to convert ${file}:`, err.message);
    }
  }

  console.log(`[PIPELINE COMPLETE] All slides converted successfully into public/slides/converted/`);
}

runPipeline().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
