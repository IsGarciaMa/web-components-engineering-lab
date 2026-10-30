import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const tools = {
  astro: 'astro',
  eslint: 'eslint',
  marp: '@marp-team/marp-cli',
  playwright: '@playwright/test',
  prettier: 'prettier',
  tsc: 'typescript',
  vitest: 'vitest',
};
const [command, ...args] = process.argv.slice(2);

try {
  if (!command || !Object.hasOwn(tools, command)) {
    throw new Error(
      'Indica una herramienta local: ' + Object.keys(tools).join(', '),
    );
  }

  const packageName = tools[command];
  const project = JSON.parse(
    readFileSync(resolve(root, 'package.json'), 'utf8'),
  );
  const expected =
    project.devDependencies?.[packageName] ??
    project.dependencies?.[packageName];
  const directory = resolve(root, 'node_modules', packageName);
  const manifestPath = resolve(directory, 'package.json');
  if (!expected || !existsSync(manifestPath)) {
    throw new Error(
      `Falta la dependencia local ${packageName}. Instala las dependencias declaradas con pnpm; consulta docs/environment.md.`,
    );
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.version !== expected) {
    throw new Error(
      `${packageName}: versión local ${manifest.version}; se requiere ${expected}.`,
    );
  }

  const entry =
    typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[command];
  if (!entry || !existsSync(resolve(directory, entry))) {
    throw new Error(
      `Falta el ejecutable local de ${command}. Reinstala las dependencias con pnpm.`,
    );
  }

  const result = spawnSync(
    process.execPath,
    [resolve(directory, entry), ...args],
    {
      cwd: root,
      stdio: 'inherit',
    },
  );
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
