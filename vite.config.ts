import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// Copy the hand-authored static manifest.json into dist/ after the bundle is
// written. The manifest is NOT a Vite entry (popup-only MV3, no service worker
// or content-script asset graph), so it must be copied verbatim — Chrome
// ignores the gecko block, Firefox reads it (FR-46).
function emitExtensionFiles(): Plugin {
  return {
    name: 'snowraven-emit-extension-files',
    closeBundle() {
      const outDir = resolve(HERE, 'dist');
      mkdirSync(outDir, { recursive: true });
      copyFileSync(resolve(HERE, 'manifest.json'), resolve(outDir, 'manifest.json'));
    },
  };
}

export default defineConfig({
  // HTML must reference ./assets/* — absolute /assets 404s inside a
  // chrome-extension:// / moz-extension:// popup.
  base: './',
  plugins: [react(), emitExtensionFiles()],
  build: {
    // Clear dist/ before every build so stale hashed assets never accumulate
    // (left over, they would bloat the packed release zips).
    emptyOutDir: true,
    // One shared globals.css (FR-50) — no per-entry CSS split.
    cssCodeSplit: false,
    // Never inline the 347 KB NOAA JSON; always emit it as a separate hashed
    // asset so the default-JSON import in tideStations.ts resolves to data,
    // not a URL (Build & Bundle). Future-proofs against a Vite default change.
    assetsInlineLimit: 0,
    rollupOptions: {
      // Multi-page build: the popup and the options page.
      input: {
        popup: resolve(HERE, 'popup.html'),
        options: resolve(HERE, 'options.html'),
      },
      // Excluded desktop-only deps — an accidental import becomes a BUILD ERROR
      // (QA-50 / QA-55), not silently bundled.
      external: [
        'maplibre-gl',
        'react-map-gl',
        'recharts',
        /^@tauri-apps\//,
      ],
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Isolate the timezone boundary data so its weight is visible in the
        // chunk report (NFR-04) and options.html does not pull it in.
        manualChunks(id) {
          if (id.includes('@photostructure/tz-lookup')) return 'vendor-tz';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
