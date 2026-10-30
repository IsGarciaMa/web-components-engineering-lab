import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

async function fixture(t, version) {
  const root = await mkdtemp(join(tmpdir(), 'wcel-local-tool-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'scripts'));
  await copyFile(
    new URL('../../scripts/run-local-tool.mjs', import.meta.url),
    join(root, 'scripts/run-local-tool.mjs'),
  );
  await writeFile(
    join(root, 'package.json'),
    JSON.stringify({ devDependencies: { eslint: '9.39.5' } }),
  );
  if (version) {
    const directory = join(root, 'node_modules/eslint');
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, 'package.json'),
      JSON.stringify({ version, bin: { eslint: 'cli.cjs' } }),
    );
    await writeFile(
      join(directory, 'cli.cjs'),
      'console.log(JSON.stringify(process.argv.slice(2))); process.exitCode = 7;\n',
    );
  }
  return (...args) =>
    spawnSync(
      process.execPath,
      [join(root, 'scripts/run-local-tool.mjs'), ...args],
      { encoding: 'utf8' },
    );
}

test('rechaza dependencias ausentes aunque haya ejecutables globales en PATH', async (t) => {
  const run = await fixture(t);
  const result = run('eslint');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Falta la dependencia local eslint/);
});

test('rechaza una versión local diferente de la fijada', async (t) => {
  const run = await fixture(t, '4.9.0');
  const result = run('eslint');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /se requiere 9\.39\.5/);
});

test('ejecuta el binario local, transmite argumentos literales y conserva el código de salida', async (t) => {
  const run = await fixture(t, '9.39.5');
  const args = ['--format', 'json', 'ruta con espacios', '$(no-ejecutar)'];
  const result = run('eslint', ...args);
  assert.equal(result.status, 7);
  assert.deepEqual(JSON.parse(result.stdout), args);
});
