import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';
import {
  usingLessons,
  usingLessonHref,
} from '../../src/data/using-web-components';

const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', (error) => messages.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') messages.push(message.text());
  });
});
test.afterEach(({ page }) =>
  expect(errors.get(page), 'Consola del capítulo').toEqual([]),
);

async function audit(page: Page) {
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(
    async () =>
      (
        await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'],
          },
        })
      ).violations,
  );
  expect(violations).toEqual([]);
}

test('siete lecciones con navegación activa, recursos y progreso independiente', async ({
  page,
}) => {
  await page.goto('/capitulos/01-using-web-components/');
  await expect(page.locator('.using-lesson-grid li')).toHaveCount(7);
  await page.getByRole('link', { name: 'Empezar el capítulo' }).click();
  for (const lesson of usingLessons) {
    await expect(page).toHaveURL(usingLessonHref(lesson.slug));
    await page.locator('.using-lesson-nav summary').click();
    await expect(
      page.locator('.using-lesson-nav [aria-current="page"]'),
    ).toHaveText(lesson.title);
    await expect(
      page.getByRole('heading', { name: 'Objetivos', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Referencias oficiales', exact: true }),
    ).toBeVisible();
    await page.locator('.using-next a').last().click();
  }
  await expect(page).toHaveURL('/ejercicios/using-web-components/');
});

test('biblioteca npm: registro, teclado y disabled', async ({ page }) => {
  await page.goto('/laboratorios/using-web-components/bibliotecas/');
  const button = page
    .locator('wa-button')
    .getByRole('button', { name: 'Confirmar con Web Awesome' });
  await button.focus();
  await page.keyboard.press('Space');
  await expect(
    page.locator('lab-library-lab').getByRole('status'),
  ).toContainText('1 activaciones');
  await page.getByLabel('Desactivar componente').check();
  await expect(button).toBeDisabled();
});

test('inspector: objetos, atributos, método silencioso y eventos limitados', async ({
  page,
}) => {
  await page.goto('/laboratorios/using-web-components/inspector/');
  const lab = page.locator('lab-inspector-lab');
  await lab.getByRole('button', { name: 'Asignar objeto' }).click();
  await expect(lab.locator('pre[aria-label]')).toContainText('"name": "Ada"');
  await expect(lab.locator('pre[aria-label]')).toContainText(
    '"readerAttribute": null',
  );
  await expect(lab.getByRole('listitem')).toHaveCount(0);
  await lab.getByRole('button', { name: 'Escribir atributo' }).click();
  await expect(lab.locator('pre[aria-label]')).toContainText('Desde atributo');
  const action = lab.getByRole('button', { name: 'Seleccionar lectura' });
  for (let i = 0; i < 7; i += 1) await action.click();
  await expect(lab.getByRole('listitem')).toHaveCount(5);
  await expect(lab.getByRole('list')).toContainText('"composed":true');
  await lab.getByRole('button', { name: 'Llamar reset()' }).click();
  await expect(action).toHaveAttribute('aria-pressed', 'false');
  await expect(lab.getByRole('listitem')).toHaveCount(5);
});

test('tokens heredados, excepción local y partes directas/reexportadas', async ({
  page,
}) => {
  await page.goto('/laboratorios/using-web-components/temas/');
  const cards = page.locator('lab-theme-lab lab-reading-card');
  await expect(cards).toHaveCount(2);
  const radius = page.getByRole('slider', { name: 'Radio (px)' });
  await radius.focus();
  await radius.press('End');
  for (let i = 0; i < 8; i += 1) await radius.press('ArrowLeft');
  await expect
    .poll(() =>
      cards
        .first()
        .locator('article')
        .evaluate((node) => getComputedStyle(node).borderRadius),
    )
    .toBe('24px');
  expect(
    await cards
      .nth(1)
      .locator('article')
      .evaluate((node) => getComputedStyle(node).borderRadius),
  ).toBe('0px');
  await page.getByLabel('Tema de la demo').selectOption('dark');
  await expect
    .poll(() =>
      cards
        .first()
        .locator('article')
        .evaluate((node) => getComputedStyle(node).backgroundColor),
    )
    .toBe('rgb(24, 34, 37)');
  await page.goto('/laboratorios/using-web-components/parts/');
  await page.getByRole('button', { name: 'Aplicar CSS Parts' }).click();
  // Playwright atraviesa raíces abiertas; el consumidor de producción usa ::part.
  const buttons = page
    .locator('lab-parts-lab lab-reading-card')
    .getByRole('button');
  await expect(buttons).toHaveCount(2);
  for (const button of await buttons.all())
    expect(
      await button.evaluate((node) => getComputedStyle(node).borderTopStyle),
    ).toBe('dashed');
});

test('el registro conserva nodo y enlace, y solo puede repetirse con recarga', async ({
  page,
}) => {
  await page.goto('/laboratorios/using-web-components/registro/');
  const note = page.locator('lab-deferred-note');
  await expect
    .poll(() => note.evaluate((node) => node.matches(':defined')))
    .toBe(false);
  const original = await note.elementHandle();
  if (!original) throw new Error('Falta la nota');
  await page.getByRole('button', { name: 'Registrar componente' }).click();
  await expect
    .poll(() => note.evaluate((node) => node.matches(':defined')))
    .toBe(true);
  expect(await original.evaluate((node) => node.isConnected)).toBe(true);
  await expect(note.getByRole('link')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Registrar componente' }),
  ).toBeDisabled();
});

test('React y Astro pasan objetos y reciben el evento actualizado', async ({
  page,
}) => {
  await page.goto('/laboratorios/using-web-components/frameworks/');
  const react = page.locator('lab-react-demo');
  await react
    .getByRole('button', { name: 'Cambiar lector desde React' })
    .click();
  await expect(react.locator('lab-reading-card')).toHaveJSProperty('reader', {
    name: 'Grace',
  });
  await react.getByRole('button', { name: 'Seleccionar lectura' }).click();
  await expect(react.getByRole('status')).toContainText('Grace');
  const astro = page.locator('lab-astro-consumer');
  await astro
    .getByRole('button', { name: 'Asignar lector desde Astro' })
    .click();
  await astro.getByRole('button', { name: 'Seleccionar lectura' }).click();
  await expect(astro.getByRole('status')).toContainText('Ada desde Astro');
});

test('SSG conserva lectura sin JavaScript y DSD no necesita registro', async ({
  browser,
  baseURL,
}) => {
  if (!baseURL) throw new Error('Falta baseURL de Playwright');
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto('/capitulos/01-using-web-components/07-renderizado/');
  await expect(
    page
      .locator('lab-static-summary')
      .getByText(
        'La documentación es accesible antes de descargar el JavaScript.',
        { exact: true },
      ),
  ).toBeVisible();
  await expect(page.locator('[data-summary-detail]')).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Mostrar u ocultar explicación',
      includeHidden: true,
    }),
  ).toBeHidden();
  await expect(
    page
      .locator('.using-dsd')
      .getByText(
        'Esta raíz shadow la crea el parser HTML, sin registrar una clase.',
        { exact: true },
      ),
  ).toBeVisible();
  await context.close();
});

test('mejora cliente: conserva contenido, foco y aria-expanded', async ({
  page,
}) => {
  await page.goto('/laboratorios/using-web-components/renderizado/');
  const button = page.getByRole('button', {
    name: 'Mostrar u ocultar explicación',
  });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-summary-detail]')).toBeHidden();
  await expect(button).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-summary-detail]')).toBeVisible();
});

test('migra progreso anterior y completa una nueva lección sin perderlo', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'lab-learning-progress-v1',
      '{"version":1,"completed":true}',
    ),
  );
  await page.goto(usingLessonHref(usingLessons[0].slug));
  const progress = page.locator('lab-learning-progress');
  await expect(
    progress.getByText('1 de 8 lecciones disponibles completadas.'),
  ).toBeVisible();
  await progress
    .getByRole('button', { name: 'Marcar lección como completada' })
    .click();
  await page.reload();
  await expect(
    progress.getByText('2 de 8 lecciones disponibles completadas.'),
  ).toBeVisible();
  await progress
    .getByRole('button', { name: 'Borrar y desactivar progreso' })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem('lab-learning-progress-v1')),
  ).toBeNull();
  expect(
    await page.evaluate(() => localStorage.getItem('lab-learning-progress-v2')),
  ).toBeNull();
});

test('tres ejercicios con soluciones voluntarias y presentación generada', async ({
  page,
}) => {
  for (const slug of ['01-basico', '02-intermedio', '03-avanzado']) {
    await page.goto(`/ejercicios/using-web-components/${slug}/`);
    const solution = page
      .locator('main details')
      .filter({ hasText: 'Consultar la solución razonada' });
    await expect(solution).not.toHaveAttribute('open');
    await solution.locator('summary').click();
    await expect(solution.locator('pre')).toBeVisible();
  }
  const response = await page.goto('/slides/using-web-components.html');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1').first()).toHaveText('Using Web Components');
});

test('conserva la URL de PR-00 mediante redirección al capítulo publicado', async ({
  page,
}) => {
  await page.goto('/capitulos/01-plataforma-web/');
  await expect(page).toHaveURL('/capitulos/01-using-web-components/');
});

for (const width of [320, 375, 768, 1280, 1440]) {
  for (const group of ['lecciones', 'laboratorios'] as const) {
    test(`${group}: reflow y axe a ${width}px`, async ({ page }) => {
      test.setTimeout(60_000); // Cada caso recorre siete u ocho páginas con axe.
      await page.setViewportSize({ width, height: 900 });
      const routes =
        group === 'lecciones'
          ? usingLessons.map((lesson) => usingLessonHref(lesson.slug))
          : [
              'bibliotecas',
              'temas',
              'parts',
              'registro',
              'inspector',
              'eventos',
              'frameworks',
              'renderizado',
            ].map((slug) => `/laboratorios/using-web-components/${slug}/`);
      for (const route of routes) {
        await page.goto(route);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.evaluate(async () => {
          for (const node of document.querySelectorAll(
            'lab-library-lab, lab-theme-lab, lab-parts-lab, lab-undefined-lab, lab-inspector-lab, lab-react-demo, lab-static-summary',
          )) {
            await customElements.whenDefined(node.localName);
            if ('updateComplete' in node) await node.updateComplete;
          }
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          route,
        ).toBe(true);
        await audit(page);
      }
    });
  }
}

test('ambos temas, RTL, reduced motion y forced colors del capítulo', async ({
  page,
}) => {
  await page.goto('/capitulos/01-using-web-components/02-temas/');
  for (const theme of ['light', 'dark']) {
    await page
      .locator('starlight-theme-select select:visible')
      .selectOption(theme);
    await audit(page);
  }
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
  await page.getByRole('slider', { name: 'Radio (px)' }).press('End');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('capturas del capítulo y los laboratorios', async ({ page }, testInfo) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [name, route] of [
      ['capitulo', '/capitulos/01-using-web-components/'],
      ['temas', '/laboratorios/using-web-components/temas/'],
      ['frameworks', '/laboratorios/using-web-components/frameworks/'],
    ]) {
      if (!route || !name) throw new Error('Falta ruta de captura');
      await page.goto(route);
      if (name === 'temas')
        await expect(page.getByLabel('Tema de la demo')).toBeVisible();
      if (name === 'frameworks')
        await expect(
          page.getByRole('button', { name: 'Cambiar lector desde React' }),
        ).toBeVisible();
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
    }
  }
});
