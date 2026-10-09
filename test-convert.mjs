import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

async function run() {
  const inputPath = path.resolve('public/slides/original/JP2K-33003-1.svs');
  const outputDir = path.resolve('public/slides/converted/JP2K-33003-1');
  const outputDzi = path.join(outputDir, 'slide.dzi');

  await fs.mkdir(outputDir, { recursive: true });

  console.log(`[LIBVIPS] Inspecting SVS container: ${inputPath}`);
  const image = sharp(inputPath, { limitInputPixels: false });
  const meta = await image.metadata();
  console.log(`[LIBVIPS] Dimensions: ${meta.width}x${meta.height}, Format: ${meta.format}, Channels: ${meta.channels}`);

  console.log(`[LIBVIPS] Generating Deep Zoom Image (DZI) pyramid into: ${outputDzi}`);
  await sharp(inputPath, { limitInputPixels: false })
    .tile({
      size: 256,
      overlap: 0,
      layout: 'dz'
    })
    .toFile(outputDzi);

  console.log(`[LIBVIPS SUCCESS] DZI pyramid and tile hierarchy successfully created!`);
}

run().catch((err) => {
  console.error('[LIBVIPS ERROR]', err);
  process.exit(1);
});
