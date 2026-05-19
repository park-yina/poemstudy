import { spawn, spawnSync } from 'child_process';

const root = process.cwd();

const initial = spawnSync(
  process.execPath,
  ['scripts/generate-search-index.mjs'],
  {
    cwd: root,
    stdio: 'inherit',
  },
);

if (initial.status !== 0) {
  process.exit(initial.status || 1);
}

const watcher = spawn(
  process.execPath,
  ['scripts/watch-search-index.mjs', '--skip-initial'],
  {
    cwd: root,
    stdio: 'inherit',
  },
);

const docusaurus = spawn(
  process.execPath,
  [
    'node_modules/@docusaurus/core/bin/docusaurus.mjs',
    'start',
    ...process.argv.slice(2),
  ],
  {
    cwd: root,
    stdio: 'inherit',
  },
);

function shutdown(code = 0) {
  if (!watcher.killed) {
    watcher.kill();
  }

  if (!docusaurus.killed) {
    docusaurus.kill();
  }

  process.exit(code);
}

watcher.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`[dev] search watcher exited with code ${code}`);
  }
});

docusaurus.on('exit', (code) => {
  shutdown(code || 0);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

