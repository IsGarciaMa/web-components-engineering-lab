import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { JSDOM } from 'jsdom';

const root = resolve('dist');
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory()
        ? htmlFiles(path)
        : entry.name.endsWith('.html')
          ? [path]
          : [];
    }),
  );
  return nested.flat();
}
const files = await htmlFiles(root);
assert.ok(files.length > 0, 'Ejecuta pnpm build antes de validar el HTML.');
const documents = new Map();
async function readDocument(path) {
  if (!documents.has(path))
    documents.set(path, new JSDOM(await readFile(path, 'utf8')));
  return documents.get(path).window.document;
}
const failures = [];
let references = 0;
for (const file of files) {
  const document = await readDocument(file);
  const route = relative(root, file)
    .split(sep)
    .join('/')
    .replace(/index\.html$/, '');
  const base = new URL(route, 'https://lab.invalid/');
  if (!route.startsWith('slides/')) {
    for (const node of document.querySelectorAll('pre, table')) {
      assert.equal(
        node.getAttribute('tabindex'),
        '0',
        `${route}: región de lectura sin acceso de teclado`,
      );
    }
  }
  for (const node of document.querySelectorAll('[href], [src]')) {
    for (const attr of ['href', 'src']) {
      const value = node.getAttribute(attr);
      if (!value) continue;
      const url = new URL(value, base);
      if (url.origin !== base.origin) continue;
      references += 1;
      let destination = resolve(root, '.' + decodeURIComponent(url.pathname));
      try {
        if ((await stat(destination)).isDirectory())
          destination = resolve(destination, 'index.html');
        await stat(destination);
        if (url.hash && destination.endsWith('.html')) {
          const target = await readDocument(destination);
          assert.ok(
            target.getElementById(decodeURIComponent(url.hash.slice(1))),
            'Fragmento inexistente',
          );
        }
      } catch {
        failures.push(`${route}: ${value}`);
      }
    }
  }
}
for (const dom of documents.values()) dom.window.close();
assert.deepEqual(failures, [], 'Referencias locales o fragmentos rotos');
console.log(
  `${files.length} HTML y ${references} referencias locales/fragmentos válidos. No ejecuta scripts ni verifica destinos externos.`,
);
