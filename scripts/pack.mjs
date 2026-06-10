#!/usr/bin/env node
// Post-build pack step (npm run pack). Zips dist/ into two identically-contented
// archives named per store purely for upload clarity — the single manifest's
// gecko block is ignored by Chrome and read by Firefox (FR-46), so there is no
// per-browser fork. Run `npm run build` first.

import { createWriteStream } from 'node:fs'
import { mkdir, access, readdir, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')
const DIST = join(REPO, 'dist')
const OUT = join(REPO, 'artifacts')

const run = promisify(execFile)

async function exists(p) {
  try { await access(p); return true } catch { return false }
}

// Read the version from the source manifest so archive names track the release.
async function readVersion() {
  const m = JSON.parse(await readFile(join(REPO, 'manifest.json'), 'utf8'))
  return m.version ?? '0.0.0'
}

async function main() {
  if (!(await exists(DIST))) {
    console.error('dist/ not found — run `npm run build` first.')
    process.exit(1)
  }
  await mkdir(OUT, { recursive: true })
  const version = await readVersion()

  // Prefer the system `zip` for deterministic, dependency-free archiving.
  const targets = [
    `snowraven-mini-chrome-${version}.zip`,
    `snowraven-mini-firefox-${version}.zip`,
  ]
  for (const name of targets) {
    const dest = join(OUT, name)
    await run('zip', ['-r', '-X', dest, '.'], { cwd: DIST })
    const s = await stat(dest)
    console.log(`packed ${relative(REPO, dest)} (${(s.size / 1024).toFixed(1)} KB)`)
  }
}

// Keep `createWriteStream`/`readdir` imported for a future archiver fallback,
// but the system-zip path is the supported one. Touch them so lint/tsc-less
// node does not warn on unused — they are part of the documented fallback shape.
void createWriteStream
void readdir

main().catch(e => { console.error(e); process.exit(1) })
