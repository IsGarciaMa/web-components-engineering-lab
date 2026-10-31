import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import { format, resolveConfig } from 'prettier';

const typedSource = `
import { Reader } from './examples/using/selection-contract';
export function readerName(reader: Reader | undefined): string {
  if (!reader) {
    return 'Visitante';
  } else {
    return reader.name;
  }
}
`;

test('las reglas TS detectan el patrón y su autofix es estable con Prettier', async () => {
  const filePath = 'src/readability-fixture.ts';
  const options = { ...(await resolveConfig(filePath)), filepath: filePath };
  const source = await format(typedSource, options);
  const checker = new ESLint();
  const [before] = await checker.lintText(source, { filePath });

  assert.ok(before);
  assert.ok(
    before.messages.some((message) => message.ruleId === 'no-else-return'),
  );
  assert.ok(
    before.messages.some(
      (message) =>
        message.ruleId === '@typescript-eslint/consistent-type-imports',
    ),
  );

  const fixer = new ESLint({ fix: true });
  const [fixed] = await fixer.lintText(source, { filePath });
  assert.ok(fixed);
  const formatted = await format(fixed.output ?? source, options);
  const [after] = await fixer.lintText(formatted, { filePath });

  assert.ok(after);
  assert.equal(after.errorCount, 0);
  assert.equal(after.warningCount, 0);
  assert.equal(after.output, undefined);
  assert.equal(await format(formatted, options), formatted);
});

test('Astro con tipos y JavaScript conservan sus parsers y reglas aplicables', async () => {
  const eslint = new ESLint();
  const astroSource = `---
import type { Reader } from './examples/using/selection-contract';
const reader: Reader = { name: 'Ada' };
---
<p>{reader.name}</p>
`;
  const [astro] = await eslint.lintText(astroSource, {
    filePath: 'src/readability-fixture.astro',
  });
  const [javascript] = await eslint.lintText(
    "export function label(value) { if (value) { return 'Disponible'; } else { return 'Pendiente'; } }",
    { filePath: 'scripts/readability-fixture.mjs' },
  );

  assert.ok(astro);
  assert.equal(astro.errorCount, 0);
  assert.equal(astro.warningCount, 0);
  assert.ok(javascript);
  assert.equal(javascript.fatalErrorCount, 0);
  assert.ok(
    javascript.messages.some((message) => message.ruleId === 'no-else-return'),
  );
  assert.ok(
    javascript.messages.every(
      (message) =>
        message.ruleId !== '@typescript-eslint/consistent-type-imports',
    ),
  );
});
