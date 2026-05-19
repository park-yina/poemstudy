import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const root = process.cwd();
const contentDirectories = ['docs'];
const watchedDirectories = new Set();

let timer = null;
let running = false;
let pendingReason = '';

function runGenerate(reason) {
  if (running) {
    pendingReason = reason;
    return;
  }

  running = true;
  pendingReason = '';

  const child = spawn(
    process.execPath,
    ['scripts/generate-search-index.mjs'],
    {
      cwd: root,
      stdio: 'inherit',
    },
  );

  child.on('exit', (code) => {
    running = false;

    if (code !== 0) {
      console.error(`[search-watch] index generation failed after ${reason}`);
    }

    if (pendingReason) {
      const nextReason = pendingReason;
      pendingReason = '';
      runGenerate(nextReason);
    }
  });
}

function scheduleGenerate(reason) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    runGenerate(reason);
  }, 180);
}

if (!process.argv.includes('--skip-initial')) {
  runGenerate('startup');
}

function watchDirectory(directory) {
  if (
    watchedDirectories.has(directory) ||
    !fs.existsSync(directory)
  ) {
    return;
  }

  const label = path.relative(root, directory);

  try {
    fs.watch(
      directory,
      {
        recursive: true,
      },
      (_eventType, filename) => {
        const changedFile = String(filename || '');

        if (!/\.(md|mdx)$/i.test(changedFile)) {
          return;
        }

        scheduleGenerate(`${label}/${changedFile}`);
      },
    );

    console.log(`[search-watch] watching ${label}`);
    watchedDirectories.add(directory);
  } catch (error) {
    console.warn(`[search-watch] could not watch ${label}: ${error.message}`);
  }
}

contentDirectories
  .map((directory) => path.join(root, directory))
  .forEach(watchDirectory);

try {
  fs.watch(root, (_eventType, filename) => {
    const changedName = String(filename || '');

    if (!contentDirectories.includes(changedName)) {
      return;
    }

    watchDirectory(path.join(root, changedName));
  });
} catch (error) {
  console.warn(`[search-watch] could not watch repository root: ${error.message}`);
}

if (watchedDirectories.size === 0) {
  console.warn('[search-watch] no docs or blog directory found');
}
