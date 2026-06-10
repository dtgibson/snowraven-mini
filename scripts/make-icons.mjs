// Rasterize the SnowRaven logo (brand/icon.svg — the raven brand mark, copied
// from the snowraven repo's website/assets/logo.svg) into the extension toolbar
// PNGs at 16/32/48/128. Build-time only; `sharp` is a dev tool, never shipped.
//   node scripts/make-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'brand', 'icon.svg');
const outDir = join(root, 'public', 'icons');
mkdirSync(outDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  // density high so the 32-unit SVG rasterizes crisply before the down-resize
  await sharp(src, { density: 512 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(outDir, `icon-${size}.png`));
  console.log(`wrote public/icons/icon-${size}.png`);
}
