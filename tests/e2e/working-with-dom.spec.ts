import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';
import {
  domLessons,
  domLabs,
  domLessonHref,
} from '../../src/data/working-with-dom';

const errors = new WeakMap<Page, string[]>();
const href = (slug: string) => `/laboratorios/working-with-dom/${slug}/`;

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
  expect(errors.get(page), 'Consola y excepciones inesperadas').toEqual([]);
});

test('recorre ocho lecciones con navegación activa y diagramas', async ({
  page,
}) => {
  await page.goto('/capitulos/03-atributos-propiedades/');
  await expect(page).toHaveURL('/capitulos/03-working-with-dom/');
  await page.getByRole('link', { name: 'Empezar el capítulo →' }).click();
  for (const lesson of domLessons) {
    await expect(page).toHaveURL(domLessonHref(lesson.slug));
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
  await expect(page).toHaveURL('/ejercicios/working-with-dom/');
});

for (const tag of ['lab-native-tabs', 'lab-lit-tabs']) {
  test(`${tag}: teclado manual, roving tabindex, ARIA y salida por Tab`, async ({
    page,
  }) => {
    await page.goto(href('tabs'));
    const tabs = page.locator(tag);
    const intro = tabs.getByRole('tab', { name: 'Introducción', exact: true });
    const contract = tabs.getByRole('tab', { name: 'Contrato', exact: true });
    await intro.focus();
    await page.keyboard.press('ArrowRight');
    await expect(contract).toBeFocused();
    await expect(contract).toHaveAttribute('tabindex', '0');
    await expect(intro).toHaveAttribute('aria-selected', 'true');
    await expect(contract).toHaveAttribute('aria-selected', 'false');
    await page.keyboard.press('Enter');
    await expect(contract).toHaveAttribute('aria-selected', 'true');
    const panel = tabs.getByRole('tabpanel');
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute(
      'id',
      (await contract.getAttribute('aria-controls')) ?? '',
    );
    await expect(panel).toHaveAttribute(
      'aria-labelledby',
      (await contract.getAttribute('id')) ?? '',
    );
    await expect(tabs.locator('[role="tabpanel"][hidden]')).toHaveCount(2);
    await page.keyboard.press('End');
    const events = tabs.getByRole('tab', { name: 'Eventos', exact: true });
    await expect(events).toBeFocused();
    await expect(contract).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Space');
    await expect(events).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Tab');
    await expect(tabs.getByRole('tabpanel')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(events).toBeFocused();
    await page.keyboard.press('Home');
    await expect(intro).toBeFocused();
    await expect(events).toHaveAttribute('aria-selected', 'true');
  });

  test(`${tag}: deshabilitados, cambios de datos y recuperación de foco`, async ({
    page,
  }) => {
    await page.goto(href('tabs'));
    const tabs = page.locator(tag);
    const contract = tabs.getByRole('tab', { name: 'Contrato', exact: true });
    await contract.click();
    const id = await contract.getAttribute('id');
    // Operación de API para retirar/deshabilitar mientras el foco sigue en el tab.
    await contract.focus();
    await tabs.evaluate((node) => {
      if (!('items' in node) || !Array.isArray(node.items)) {
        throw new Error('API items ausente');
      }
      node.items = node.items.map(
        (item: { id: string; label: string; disabled?: boolean }) => ({
          ...item,
          disabled: item.id === 'contract',
        }),
      );
    });
    await expect(contract).toBeDisabled();
    const intro = tabs.getByRole('tab', { name: 'Introducción', exact: true });
    await expect(intro).toBeFocused();
    await expect(intro).toHaveAttribute('aria-selected', 'true');
    await expect(contract).toHaveAttribute('id', id ?? '');
    await page.keyboard.press('ArrowRight');
    await expect(
      tabs.getByRole('tab', { name: 'Eventos', exact: true }),
    ).toBeFocused();
    await page
      .getByRole('button', { name: 'Vaciar o restaurar pestañas' })
      .click();
    await expect(tabs.getByRole('tab')).toHaveCount(0);
    await expect(tabs.getByRole('tablist')).toHaveCount(0);
    await expect(
      tabs.getByText('No hay pestañas disponibles.', { exact: true }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Vaciar o restaurar pestañas' })
      .click();
    await expect(tabs.getByRole('tab')).toHaveCount(3);
  });

  test(`${tag}: escritura externa no roba foco y ocultar panel enfocado lo recupera`, async ({
    page,
  }) => {
    await page.goto(href('tabs'));
    const inspect = page.getByRole('button', { name: 'Inspeccionar árboles' });
    await inspect.focus();
    const tabs = page.locator(tag);
    await tabs.evaluate((node) => {
      if (!('selected' in node)) {
        throw new Error('API selected ausente');
      }
      node.selected = 'contract';
    });
    await expect(inspect).toBeFocused();
    const link = tabs.locator('section[slot="contract"] a');
    await link.focus();
    await tabs.evaluate((node) => {
      if ('selected' in node) {
        node.selected = 'events';
      }
    });
    await expect(
      tabs.getByRole('tab', { name: 'Eventos', exact: true }),
    ).toBeFocused();
    await expect(link).not.toBeVisible();
  });
}

test('Host DOM y metadatos conservan la identidad del contenido proyectado', async ({
  page,
}) => {
  await page.goto(href('tabs'));
  await page.getByRole('button', { name: 'Inspeccionar árboles' }).click();
  const status = page.locator('lab-tabs-playground pre');
  await expect(status).toContainText('"childParentIsHost": true');
  await expect(status).toContainText('"hostQueryForTabs": 0');
  await expect(status).toContainText('"shadowQueryForTabs": 3');
  await page.getByRole('button', { name: 'Añadir o retirar panel' }).click();
  for (const tag of ['lab-native-tabs', 'lab-lit-tabs']) {
    const tabs = page.locator(tag);
    await tabs.getByRole('tab', { name: 'Panel adicional' }).click();
    await expect(tabs.locator('section[slot="extra"]')).toBeVisible();
  }
});

test('Inspector: atributos, presencia booleana y normalización al mismo valor', async ({
  page,
}) => {
  await page.goto(href('inspector'));
  const lab = page.locator('lab-tabs-attributes');
  await lab
    .getByRole('button', { name: 'setAttribute selected', exact: true })
    .click();
  await expect(lab.locator('pre')).toContainText('"property": "contract"');
  await lab.getByLabel('ID de selección').fill('not-found');
  await lab
    .getByRole('button', { name: 'setAttribute selected', exact: true })
    .click();
  await expect(lab.locator('pre')).toContainText('"attribute": "intro"');
  await lab
    .getByRole('button', { name: 'disabled="false"', exact: true })
    .click();
  await expect(lab.locator('pre')).toContainText('"disabledProperty": true');
  await lab.getByRole('button', { name: 'toggleAttribute disabled' }).click();
  await expect(lab.locator('pre')).toContainText('"disabledProperty": false');
  await expect(lab.locator('pre')).toContainText('"itemsAttribute": null');
});

test('cancela intención, sincroniza una vez y mantiene escrituras programáticas silenciosas', async ({
  page,
}) => {
  await page.goto(href('seleccion'));
  const lab = page.locator('lab-tabs-selection');
  const native = lab.locator('lab-native-tabs');
  const lit = lab.locator('lab-lit-tabs');
  await native.getByRole('tab', { name: 'Contrato', exact: true }).click();
  await expect(
    lit.getByRole('tab', { name: 'Contrato', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  const rows = lab
    .getByRole('list', { name: 'Registro de selección' })
    .getByRole('listitem');
  await expect(rows).toHaveCount(1);
  await lab.getByLabel('Cancelar before-tab-change').check();
  await native.getByRole('tab', { name: 'Eventos', exact: true }).click();
  await expect(
    native.getByRole('tab', { name: 'Contrato', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await expect(rows).toHaveCount(1);
  await lab
    .getByRole('button', { name: 'Seleccionar Eventos desde JavaScript' })
    .click();
  await expect(
    native.getByRole('tab', { name: 'Eventos', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await expect(
    lit.getByRole('tab', { name: 'Eventos', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await expect(rows).toHaveCount(1);
});

test('explora flags, retargeting, captura y cancelación sin fabricar recorrido', async ({
  page,
}) => {
  await page.goto(href('eventos'));
  const lab = page.locator('lab-dom-events');
  const emit = lab.getByRole('button', {
    name: 'Emitir evento desde Shadow DOM',
  });
  const log = lab.getByRole('list', { name: 'Recorrido del evento' });
  await emit.click();
  await expect(log).toContainText(
    'consumidor (capture): fase 1; target lab-event-probe',
  );
  await expect(log).toContainText('emisor (bubble): fase 2; target button');
  await lab.getByRole('button', { name: 'Vaciar registro de eventos' }).click();
  await lab.getByLabel('bubbles', { exact: true }).uncheck();
  await emit.click();
  await expect(log).toContainText('consumidor (capture)');
  await expect(log).not.toContainText('consumidor (bubble)');
  await lab.getByRole('button', { name: 'Vaciar registro de eventos' }).click();
  await lab.getByLabel('composed', { exact: true }).uncheck();
  await emit.click();
  await expect(log).not.toContainText('consumidor');
  await expect(log).toContainText('emisor');
  await lab.getByLabel('Llamar preventDefault').check();
  await emit.click();
  await expect(lab.locator('lab-event-probe p')).toContainText(
    'devolvió false; defaultPrevented true',
  );
  await lab.getByLabel('cancelable', { exact: true }).uncheck();
  await emit.click();
  await expect(lab.locator('lab-event-probe p')).toContainText(
    'devolvió true; defaultPrevented false',
  );
});

test('registro local: capacidad real o alternativa global explícita', async ({
  page,
}) => {
  await page.goto(domLessonHref('08-registries'));
  await page
    .getByRole('button', { name: 'Probar registro local opcional' })
    .click();
  const demo = page.locator('lab-registry-demo');
  const status = demo.getByRole('status');
  const supported = await status.textContent();
  if (supported?.includes('Instancia local: true')) {
    await expect(
      demo.getByText('Definición del registro local.'),
    ).toBeVisible();
    await expect(status).toContainText(
      'Registro global contiene nombre: false',
    );
  } else {
    await expect(status).toContainText(
      /no (disponible|se ha verificado soporte)/i,
    );
  }
  expect(
    await page.evaluate(() => Boolean(customElements.get('lab-scoped-note'))),
  ).toBe(false);
});

test('progreso preservado, tres soluciones cerradas y Marp generado', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'lab-learning-progress-v2',
      '{"version":2,"completedIds":["defining-lifecycle"]}',
    ),
  );
  await page.goto(domLessonHref('06-selection'));
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
    await page.goto(`/ejercicios/working-with-dom/${slug}/`);
    const summary = page.getByText('Consultar la solución razonada', {
      exact: true,
    });
    await expect(summary.locator('..')).not.toHaveAttribute('open');
    await summary.click();
    await expect(summary.locator('..').locator('pre')).toBeVisible();
  }
  const response = await page.goto('/slides/working-with-dom.html');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1').first()).toContainText(
    'Working with the DOM',
  );
});

for (const width of [320, 375, 768, 1280, 1440]) {
  test(`laboratorios, teclado y axe a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const lab of domLabs) {
      await page.goto(href(lab.slug));
      await expect(
        page.locator('.using-lab-stage button').first(),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
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
    await page.goto(href('tabs'));
    for (const tag of ['lab-native-tabs', 'lab-lit-tabs']) {
      const tabs = page.locator(tag);
      await tabs
        .getByRole('tab', { name: 'Introducción', exact: true })
        .focus();
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await expect(
        tabs.getByRole('tab', { name: 'Eventos', exact: true }),
      ).toHaveAttribute('aria-selected', 'true');
    }
  });
}

test('texto al 200%, RTL, forced colors y movimiento reducido', async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto(href('tabs'));
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.style.fontSize = '200%';
  });
  for (const tag of ['lab-native-tabs', 'lab-lit-tabs']) {
    const tabs = page.locator(tag);
    await tabs.getByRole('tab', { name: 'Introducción', exact: true }).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(
      tabs.getByRole('tab', { name: 'Contrato', exact: true }),
    ).toBeFocused();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('capturas del mapa, Tabs y propagación', async ({ page }, testInfo) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [name, route] of [
      ['dom-mapa', '/capitulos/03-working-with-dom/'],
      ['dom-tabs', href('tabs')],
      ['dom-eventos', href('eventos')],
    ] as const) {
      await page.goto(route);
      if (name === 'dom-tabs') {
        await page
          .locator('lab-native-tabs')
          .getByRole('tab', { name: 'Contrato', exact: true })
          .click();
      }
      if (name === 'dom-eventos') {
        await page
          .getByRole('button', { name: 'Emitir evento desde Shadow DOM' })
          .click();
      }
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
    }
  }
});
