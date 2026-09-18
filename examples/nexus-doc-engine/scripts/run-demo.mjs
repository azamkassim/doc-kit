import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

await import('./build-input.mjs');

const repoRoot = path.resolve(
  fileURLToPath(new URL('../../..', import.meta.url))
);
const demoRoot = path.join(repoRoot, 'examples', 'nexus-doc-engine');
const cliPath = path.join(repoRoot, 'packages', 'cli', 'bin', 'cli.mjs');

const args = [
  cliPath,
  'generate',
  '-t',
  'html',
  '-t',
  'orama-db',
  '-t',
  'llms-txt',
  '-i',
  'generated/*.md',
  '-o',
  'out',
  '--index',
  'generated/index.md',
];

const child = spawn(process.execPath, args, {
  cwd: demoRoot,
  stdio: 'inherit',
});

child.on('exit', code => {
  process.exitCode = code ?? 1;
});

child.on('error', error => {
  console.error(error);
  process.exitCode = 1;
});
