import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const args = process.argv.slice(2);
assert.ok(
  args.length === 0 || (args.length === 2 && args[0] === '--source'),
  'Uso: node scripts/validate-skills.mjs [--source <directorio>]',
);
const sourceOnly = args.length > 0;
const root = sourceOnly ? args[1] : '.agents/skills';
assert.ok(
  existsSync(root),
  `Falta ${root}. Consulta docs/skills.md; validar fuentes no acredita instalación.`,
);
if (!sourceOnly) {
  assert.ok(
    !existsSync('codex-skills'),
    'Hay dos fuentes de Skills. Completa el traslado; consulta docs/skills.md.',
  );
}
const expected = [
  'project-scaffolding',
  'frontend-architecture',
  'web-components',
  'lit-engineering',
  'technical-education',
  'accessibility-ux',
  'quality-engineering',
  'security-performance',
  'devops-vercel',
  'code-review',
  'code-readability',
];
const directories = await readdir(root, { withFileTypes: true });
assert.deepEqual(
  directories
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(),
  [...expected].sort(),
);
for (const name of expected) {
  const text = await readFile(`${root}/${name}/SKILL.md`, 'utf8');
  const manifest = text.match(
    /^---\nname: ([a-z0-9-]+)\ndescription: (.+)\n---\n([\s\S]+)$/,
  );
  assert.ok(
    manifest,
    `${name}: frontmatter name/description y cuerpo requeridos`,
  );
  assert.equal(manifest[1], name);
  assert.ok(manifest[2]?.trim(), `${name}: falta descripción de activación`);
  assert.ok(manifest[3]?.trim(), `${name}: faltan instrucciones`);
}
console.log(
  `${expected.length} Skills válidas estructuralmente en ${root}. ${sourceOnly ? 'Solo fuentes: instalación y descubrimiento no comprobados.' : 'Confirma por separado su descubrimiento en Codex.'}`,
);
