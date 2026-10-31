import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';

declare global {
  interface Window {
    axe: typeof axe;
  }
}

const browserErrors = new WeakMap<Page, string[]>();

test.beforeEach(({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    // The 404 scenario deliberately requests this missing document.
    const expected404 =
      message.location().url.endsWith('/ruta-que-no-existe/') &&
      message.text().includes('404');
    if (!expected404) errors.push(message.text());
  });
});

test.afterEach(({ page }) => {
  expect(browserErrors.get(page), 'Errores de consola o de JavaScript').toEqual(
    [],
  );
});

for (const width of [320, 375, 768, 1280, 1440]) {
  test(`contador accesible y sin desbordamiento a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/guias/contador/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Un contrato, dos contadores',
    );

    for (const tag of ['lab-native-counter', 'lab-lit-counter']) {
      const counter = page.locator(tag);
      const button = counter.getByRole('button', {
        name: 'Incrementar',
        exact: true,
      });
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(counter.getByRole('status')).toHaveText('1');
      await page.keyboard.press('Space');
      await expect(counter.getByRole('status')).toHaveText('2');
      await expect(button).toBeFocused();
    }

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.addScriptTag({ content: axe.source });
    const violations = await page.evaluate(async () => {
      return (
        await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        })
      ).violations;
    });
    expect(violations).toEqual([]);
  });
}

test('landing, capítulos pendientes y 404', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Aprende',
  );
  await page.getByRole('link', { name: 'Entrar al laboratorio' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Laboratorios',
  );
  await page.goto('/capitulos/02-custom-elements/');
  await expect(
    page.getByText('Este capítulo todavía no está publicado.', {
      exact: false,
    }),
  ).toBeVisible();
  const response = await page.goto('/ruta-que-no-existe/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Este camino',
  );
});

test('búsqueda sobre el build de producción', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  const search = page.locator('.pagefind-ui__search-input');
  await search.fill('contador');
  await expect(
    page
      .locator('.pagefind-ui__result-link')
      .filter({ hasText: 'contadores' })
      .first(),
  ).toBeVisible();
});

test('tema, RTL, reduced motion y forced colors', async ({ page }) => {
  await page.goto('/guias/contador/');
  const select = page.locator('starlight-theme-select select:visible');
  for (const theme of ['dark', 'light']) {
    await select.selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  }
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
  await page.locator('lab-lit-counter').getByRole('button').click();
  await expect(page.locator('lab-lit-counter').getByRole('status')).toHaveText(
    '1',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('Mermaid y presentación HTML generada', async ({ page }) => {
  await page.goto('/guias/recursos/');
  await expect(page.locator('.diagram svg')).toBeVisible();
  const response = await page.goto('/slides/foundation.html');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1').first()).toContainText('Web Components');
});

test('ruta editorial, capítulo y recorrido de aprendizaje', async ({
  page,
}) => {
  await page.goto('/ruta/');
  await expect(page.locator('.chapter-card')).toHaveCount(11);
  await expect(
    page.locator('.chapter-card [data-status="pending"]'),
  ).toHaveCount(10);
  await page
    .getByRole('link', {
      name: 'Custom Elements y ciclo de vida',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Objetivos de aprendizaje' }),
  ).toBeVisible();
  await expect(
    page.getByText('Registrar un elemento con una API pública.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Índice de lecciones' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Leer la lección disponible' }).click();
  await page
    .getByRole('link', {
      name: 'Abrir el laboratorio con código y registro de eventos',
    })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Laboratorio 00 · Dos contadores',
  );
  for (const tag of ['lab-native-counter', 'lab-lit-counter']) {
    await page
      .locator(tag)
      .getByRole('button', { name: 'Incrementar', exact: true })
      .click();
  }
  await expect(page.locator('[data-event-log] li')).toHaveCount(2);
  await expect(page.locator('[data-event-log]')).toContainText('Nativo');
  await expect(page.locator('[data-event-log]')).toContainText('Lit');
  await page
    .getByRole('button', { name: 'Limpiar registro', exact: true })
    .click();
  await expect(page.locator('[data-event-log] li')).toHaveCount(0);
  await expect(page.locator('lab-lit-counter').getByRole('status')).toHaveText(
    '1',
  );
  await page
    .getByText('Implementación nativa · native-counter.ts', { exact: true })
    .click();
  await expect(page.locator('.lab-source pre').first()).toContainText(
    'class NativeCounter',
  );
  await page
    .getByText('Implementación Lit · lit-counter.ts', { exact: true })
    .click();
  await expect(page.locator('.lab-source pre').nth(1)).toContainText(
    'class LitCounter',
  );
  await page
    .getByRole('link', { name: 'Siguiente: resolver el ejercicio' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Criterios de aceptación' }),
  ).toBeVisible();
  await page
    .getByText('Consultar la solución razonada', { exact: true })
    .click();
  await expect(
    page
      .locator('details[open]')
      .filter({ hasText: 'Consultar la solución razonada' }),
  ).toContainText('updateComplete');
});

test('progreso opcional, persistente y reversible', async ({ page }) => {
  await page.goto('/guias/contador/');
  const progress = page.locator('lab-learning-progress');
  await expect(
    progress.getByRole('button', { name: 'Activar progreso local' }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem('lab-learning-progress-v2')),
  ).toBeNull();
  await progress
    .getByRole('button', { name: 'Activar progreso local' })
    .click();
  await expect(
    progress.getByRole('button', { name: 'Marcar lección como completada' }),
  ).toBeFocused();
  await progress
    .getByRole('button', { name: 'Marcar lección como completada' })
    .click();
  await expect(
    progress.getByRole('button', { name: 'Marcar como pendiente' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(
    progress.getByText('1 de 8 lecciones disponibles completadas.'),
  ).toBeVisible();
  await page.goto('/ruta/');
  await expect(
    progress.getByText('1 de 8 lecciones disponibles completadas.'),
  ).toBeVisible();
  await expect(
    page.locator('.chapter-card [data-status="pending"]'),
  ).toHaveCount(10);
  await progress
    .getByRole('button', { name: 'Borrar y desactivar progreso' })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem('lab-learning-progress-v2')),
  ).toBeNull();
  await page.reload();
  await expect(
    progress.getByRole('button', { name: 'Activar progreso local' }),
  ).toBeVisible();
});

test('almacenamiento bloqueado y datos corruptos no impiden aprender', async ({
  page,
}) => {
  await page.goto('/guias/contador/');
  await page.evaluate(() =>
    localStorage.setItem('lab-learning-progress-v2', '{invalid'),
  );
  await page.reload();
  const progress = page.locator('lab-learning-progress');
  await expect(progress.getByRole('status')).toContainText(
    'No se ha podido leer',
  );
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Bloqueado', 'SecurityError');
    };
  });
  await progress
    .getByRole('button', { name: 'Activar progreso local' })
    .click();
  await expect(progress.getByRole('status')).toContainText(
    'No se ha podido guardar',
  );
  await page.locator('lab-lit-counter').getByRole('button').click();
  await expect(page.locator('lab-lit-counter').getByRole('status')).toHaveText(
    '1',
  );
});

for (const width of [320, 375, 768, 1280, 1440]) {
  test(`academia: reflow y axe a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/ruta/',
      '/capitulos/02-custom-elements/',
      '/laboratorios/',
      '/laboratorios/contador/',
      '/ejercicios/contador/',
    ]) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      if (route === '/ruta/')
        await expect(
          page.locator('lab-learning-progress').getByRole('button'),
        ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      await page.addScriptTag({ content: axe.source });
      const violations = await page.evaluate(
        async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
              },
            })
          ).violations,
      );
      expect(violations, route).toEqual([]);
    }
  });
}

test('capturas de la experiencia principal', async ({ page }, testInfo) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [name, route] of [
      ['landing', '/'],
      ['ruta', '/ruta/'],
      ['capitulo', '/capitulos/02-custom-elements/'],
      ['laboratorio', '/laboratorios/contador/'],
    ] as const) {
      await page.goto(route);
      if (name === 'ruta')
        await expect(
          page.locator('lab-learning-progress').getByRole('button'),
        ).toBeVisible();
      if (name === 'laboratorio')
        await expect(
          page.locator('lab-lit-counter').getByRole('button'),
        ).toBeVisible();
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
    }
  }
});

test('contraste automatizado de la academia en ambos temas', async ({
  page,
}) => {
  for (const route of ['/', '/laboratorios/contador/']) {
    await page.goto(route);
    for (const theme of ['light', 'dark']) {
      await page
        .locator('starlight-theme-select select:visible')
        .selectOption(theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.addScriptTag({ content: axe.source });
      const violations = await page.evaluate(
        async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
              },
            })
          ).violations,
      );
      expect(violations, `${route} · ${theme}`).toEqual([]);
    }
  }
});
