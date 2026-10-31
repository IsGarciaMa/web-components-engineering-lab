import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';
import {
  definingLessons,
  definingLabs,
  definingLessonHref,
} from '../../src/data/defining-web-components';

const errors = new WeakMap<Page, string[]>();
const labHref = (slug: string) =>
  `/laboratorios/defining-web-components/${slug}/`;

test.beforeEach(({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', (error) => messages.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      messages.push(message.text());
    }
  });
});

test.afterEach(({ page }) => {
  expect(
    errors.get(page),
    'Errores inesperados de consola o JavaScript',
  ).toEqual([]);
});

test('recorre las nueve lecciones, su estado activo y la ruta de ejercicios', async ({
  page,
}) => {
  await page.goto('/capitulos/02-custom-elements/');
  await expect(page).toHaveURL('/capitulos/02-defining-web-components/');
  await page.getByRole('link', { name: 'Empezar el capítulo →' }).click();
  for (const lesson of definingLessons) {
    await expect(page).toHaveURL(definingLessonHref(lesson.slug));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      lesson.title,
    );
    await page.locator('.using-lesson-nav summary').click();
    await expect(
      page.locator('.using-lesson-nav [aria-current="page"]'),
    ).toHaveText(lesson.title);
    await expect(page.locator('.diagram svg')).toBeVisible();
    await page.locator('.using-next a').last().click();
  }
  await expect(page).toHaveURL('/ejercicios/defining-web-components/');
});

test('registra y mejora un host existente y un fragmento sin conectarlo', async ({
  page,
}) => {
  await page.goto(labHref('registro'));
  const lab = page.locator('lab-registration-lab');
  await lab
    .getByRole('button', { name: 'Registrar nombre', exact: true })
    .click();
  await expect(lab.getByRole('status')).toContainText('Mismo nodo: true');
  await expect(lab.getByRole('status')).toContainText(
    'Fragmento desconectado mejorado: false',
  );
  await lab.getByRole('button', { name: 'Upgrade del fragmento' }).click();
  await expect(lab.getByRole('status')).toContainText(
    'instancia desconectada true; isConnected false',
  );
  await expect(
    lab.getByRole('button', { name: 'Registrar nombre', exact: true }),
  ).toBeDisabled();
});

test('compara raíces y herencia de tokens sin acceder a closed', async ({
  page,
}) => {
  await page.goto(labHref('shadow'));
  const lab = page.locator('lab-shadow-lab');
  await lab.getByRole('button', { name: 'Inspeccionar raíces' }).click();
  await expect(lab.getByRole('status')).toContainText(
    'open.shadowRoot: open; closed.shadowRoot: null',
  );
  const frame = lab.locator('lab-open-frame p');
  const original = await frame.evaluate((node) => getComputedStyle(node).color);
  await lab.getByLabel('Heredar token de color').check();
  await expect
    .poll(() => frame.evaluate((node) => getComputedStyle(node).color))
    .not.toBe(original);
});

test('distribuye slots y conserva la propiedad de los nodos del consumidor', async ({
  page,
}) => {
  await page.goto(labHref('slots'));
  const lab = page.locator('lab-slots-lab');
  const title = lab.locator('lab-slot-card > span');
  expect(await title.evaluate((node) => node.parentElement?.localName)).toBe(
    'lab-slot-card',
  );
  await lab.getByRole('button', { name: 'Consultar asignación' }).click();
  const before = await lab.getByRole('status').textContent();
  await lab.getByLabel('Título proyectado').fill('Texto cambiado');
  await expect(title).toHaveText('Texto cambiado');
  await expect(lab.getByRole('status')).toHaveText(before ?? '');
  await lab.getByRole('button', { name: 'Alternar título asignado' }).click();
  await expect(lab.locator('lab-slot-card slot[name="title"]')).toHaveText(
    'Título de reserva',
  );
  await expect(lab.getByRole('status')).toContainText('"nodes":0');
});

test('clona estructura con datos seguros y copias independientes', async ({
  page,
}) => {
  await page.goto(labHref('templates'));
  const lab = page.locator('lab-template-lab');
  await lab
    .getByLabel('Texto de la copia')
    .fill('<img src=x onerror=alert(1)>');
  await lab.getByRole('button', { name: 'Clonar plantilla' }).click();
  await lab.getByLabel('Texto de la copia').fill('Segunda');
  await lab.getByRole('button', { name: 'Clonar plantilla' }).click();
  await expect(lab.locator('lab-template-stamp h3').first()).toHaveText(
    '<img src=x onerror=alert(1)>',
  );
  await expect(lab.locator('lab-template-stamp img')).toHaveCount(0);
  await expect(lab.locator('lab-template-stamp article')).toHaveCount(2);
  await lab.getByRole('button', { name: 'Vaciar copias' }).click();
  await expect(lab.locator('lab-template-stamp article')).toHaveCount(0);
});

test('observa callbacks reales, limpieza de listeners y adopción', async ({
  page,
}) => {
  await page.goto(labHref('lifecycle'));
  const lab = page.locator('lab-lifecycle-lab');
  const log = lab.getByRole('list', { name: 'Registro de callbacks' });
  await lab.getByRole('button', { name: 'Crear instancia' }).click();
  await expect(log.getByRole('listitem')).toHaveCount(1);
  await expect(log).toContainText('constructor');
  await lab.getByRole('button', { name: 'Aplicar atributo' }).click();
  await expect(log).toContainText('attributeChangedCallback');
  await lab.getByRole('button', { name: 'Conectar', exact: true }).click();
  await lab.getByRole('button', { name: 'Emitir señal externa' }).click();
  await expect(lab.getByRole('status')).toContainText('sonda: 1');
  await lab.getByRole('button', { name: 'Desconectar', exact: true }).click();
  await lab.getByRole('button', { name: 'Emitir señal externa' }).click();
  await expect(lab.getByRole('status')).toContainText('sonda: 1');
  await lab.getByRole('button', { name: 'Conectar', exact: true }).click();
  await lab.getByRole('button', { name: 'Emitir señal externa' }).click();
  await expect(lab.getByRole('status')).toContainText('sonda: 2');
  await lab.getByRole('button', { name: 'Mover con append' }).click();
  await expect(log).toContainText('disconnectedCallback');
  await lab.getByRole('button', { name: 'Adoptar en otro documento' }).click();
  await expect(log).toContainText('adoptedCallback');
  await lab.getByRole('button', { name: 'Conectar', exact: true }).click();
  await expect(lab.locator('lab-lifecycle-probe')).toBeVisible();
  for (let index = 0; index < 25; index += 1) {
    await lab.getByLabel('Atributo label').fill(String(index));
    await lab.getByRole('button', { name: 'Aplicar atributo' }).click();
  }
  await expect(log.getByRole('listitem')).toHaveCount(20);
  await lab.getByRole('button', { name: 'Reiniciar laboratorio' }).click();
  await expect(log.getByRole('listitem')).toHaveCount(0);
});

test('usa moveBefore cuando existe y conserva la alternativa explícita', async ({
  page,
}) => {
  await page.goto(labHref('lifecycle'));
  const lab = page.locator('lab-lifecycle-lab');
  await lab.getByRole('button', { name: 'Crear instancia' }).click();
  await lab.getByRole('button', { name: 'Conectar', exact: true }).click();
  const supported = await page.evaluate(
    () =>
      'moveBefore' in Element.prototype &&
      typeof Element.prototype.moveBefore === 'function',
  );
  await lab.getByRole('button', { name: 'Mover con moveBefore' }).click();
  if (supported) {
    await expect(
      lab.getByRole('list', { name: 'Registro de callbacks' }),
    ).toContainText('connectedMoveCallback');
  } else {
    await expect(lab.getByRole('status')).toContainText('no está disponible');
  }
  await lab.getByRole('button', { name: 'Emitir señal externa' }).click();
  await expect(lab.getByRole('status')).toContainText('sonda: 1');
});

test('compara raw/propiedad, booleanos y actualización nativa/Lit', async ({
  page,
}) => {
  await page.goto(labHref('atributos'));
  const inspector = page.locator('lab-attributes-lab');
  await inspector.getByLabel('Entrada de value').fill('250');
  await inspector
    .getByRole('button', { name: 'Escribir atributo', exact: true })
    .click();
  await expect(inspector.locator('pre[role="status"]')).toContainText(
    '"attribute":"250","property":100',
  );
  await inspector.getByRole('button', { name: 'Asignar propiedad' }).click();
  await expect(inspector.locator('pre[role="status"]')).toContainText(
    '"attribute":"100"',
  );
  await inspector
    .getByRole('button', { name: 'Escribir muted="false"' })
    .click();
  await expect(inspector.locator('pre[role="status"]')).toContainText(
    '"mutedProperty":true',
  );

  await page.goto(labHref('comparacion'));
  const comparison = page.locator('lab-comparison-lab');
  await comparison.getByLabel('Valor compartido').fill('62');
  await comparison.getByRole('button', { name: 'Actualizar ambos' }).click();
  await expect(comparison.locator('lab-native-meter output')).toHaveText(
    '62 / 100',
  );
  await expect(comparison.locator('lab-lit-meter output')).toHaveText(
    '62 / 100',
  );
  await expect(comparison.locator('p[role="status"]')).toContainText(
    'Lit «35 / 100»',
  );
  await expect(comparison.locator('p[role="status"]')).toContainText(
    'Tras updateComplete: Lit «62 / 100»',
  );
  const output = comparison.locator('lab-native-meter output');
  const color = await output.evaluate((node) => getComputedStyle(node).color);
  await comparison.getByLabel('Aplicar token de color').check();
  await expect
    .poll(() => output.evaluate((node) => getComputedStyle(node).color))
    .not.toBe(color);
});

test('depura un slot, captura el duplicado y detecta el built-in opcional', async ({
  page,
}) => {
  await page.goto(labHref('debugging'));
  const lab = page.locator('lab-debugging-lab');
  await lab
    .getByRole('button', { name: 'Alternar corrección del slot' })
    .click();
  await expect(lab.locator('span[slot="title"]')).toHaveText(
    'Título del consumidor',
  );
  await lab
    .getByRole('button', { name: 'Capturar registro duplicado' })
    .click();
  await expect(lab.getByRole('status')).toContainText('NotSupportedError');
  await lab.getByRole('button', { name: 'Probar built-in opcional' }).click();
  const button = lab.getByRole('button', { name: 'Confirmar con built-in' });
  if (await button.count()) {
    await button.click();
    await expect(lab.getByRole('status')).toContainText('Confirmaciones: 1');
  } else {
    await expect(lab.getByRole('status')).toContainText(/no (creó|disponible)/);
  }
});

test('conserva progreso anterior y las soluciones cerradas; sirve Marp', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'lab-learning-progress-v2',
      '{"version":2,"completedIds":["using-libraries"]}',
    ),
  );
  await page.goto(definingLessonHref('05-lifecycle'));
  const progress = page.locator('lab-learning-progress');
  await expect(
    progress.getByText('1 de 25 lecciones disponibles completadas.'),
  ).toBeVisible();
  await progress
    .getByRole('button', { name: 'Marcar lección como completada' })
    .click();
  await page.reload();
  await expect(
    progress.getByText('2 de 25 lecciones disponibles completadas.'),
  ).toBeVisible();
  for (const slug of ['01-basico', '02-intermedio', '03-avanzado']) {
    await page.goto(`/ejercicios/defining-web-components/${slug}/`);
    const summary = page.getByText('Consultar la solución razonada', {
      exact: true,
    });
    await expect(summary.locator('..')).not.toHaveAttribute('open');
    await summary.click();
    await expect(summary.locator('..')).toHaveAttribute('open', '');
    await expect(summary.locator('..').locator('pre')).toBeVisible();
  }
  const response = await page.goto('/slides/defining-web-components.html');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1').first()).toContainText(
    'Defining Web Components',
  );
});

for (const width of [320, 375, 768, 1280, 1440]) {
  test(`laboratorios sin desbordamiento y lifecycle accesible a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const lab of definingLabs) {
      await page.goto(labHref(lab.slug));
      await expect(
        page.locator('.using-lab-stage button').first(),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto(labHref('lifecycle'));
    await page.getByRole('button', { name: 'Crear instancia' }).click();
    await page.getByRole('button', { name: 'Conectar', exact: true }).click();
    const reset = page.getByRole('button', { name: 'Reiniciar laboratorio' });
    await reset.focus();
    await page.keyboard.press('Enter');
    await expect(reset).toBeFocused();
    await page.addScriptTag({ content: axe.source });
    expect(
      await page.evaluate(
        async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
              },
            })
          ).violations,
      ),
    ).toEqual([]);
  });
}

test('accesibilidad automatizada de los ocho laboratorios', async ({
  page,
}) => {
  for (const lab of definingLabs) {
    await page.goto(labHref(lab.slug));
    await page.addScriptTag({ content: axe.source });
    expect(
      await page.evaluate(
        async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
              },
            })
          ).violations,
      ),
      lab.title,
    ).toEqual([]);
  }
});

test('lifecycle con RTL, forced colors y movimiento reducido', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto(labHref('lifecycle'));
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
  await page.getByRole('button', { name: 'Crear instancia' }).click();
  await page.getByRole('button', { name: 'Conectar', exact: true }).click();
  await page.getByRole('button', { name: 'Emitir señal externa' }).click();
  await expect(page.locator('lab-lifecycle-lab [role="status"]')).toContainText(
    'sonda: 1',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('capturas explícitas del mapa y el visualizador', async ({
  page,
}, testInfo) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [name, route] of [
      ['defining-mapa', '/capitulos/02-defining-web-components/'],
      ['defining-lifecycle', labHref('lifecycle')],
    ] as const) {
      await page.goto(route);
      if (name === 'defining-lifecycle') {
        await page.getByRole('button', { name: 'Crear instancia' }).click();
        await page
          .getByRole('button', { name: 'Conectar', exact: true })
          .click();
      }
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
    }
  }
});
