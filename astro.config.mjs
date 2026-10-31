import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { keyboardRegions } from './scripts/keyboard-regions.mjs';

export default defineConfig({
  output: 'static',
  markdown: { processor: satteri({ hastPlugins: [keyboardRegions] }) },
  trailingSlash: 'always',
  redirects: {
    '/capitulos/02-custom-elements/': '/capitulos/02-defining-web-components/',
    '/capitulos/01-plataforma-web/': '/capitulos/01-using-web-components/',
  },
  integrations: [
    starlight({
      title: 'Web Components Engineering Lab',
      description:
        'Estándares web, ejemplos nativos e ingeniería profesional con Lit.',
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      customCss: ['./src/styles/global.css'],
      components: {
        Hero: './src/components/portal/hero.astro',
        SiteTitle: './src/components/portal/site-title.astro',
      },
      sidebar: [
        {
          label: 'Empieza aquí',
          items: [
            { label: 'Ruta de aprendizaje', slug: 'ruta' },
            { label: 'Laboratorios', slug: 'laboratorios' },
            { label: 'Acerca del proyecto', slug: 'guias/inicio' },
            { label: 'Contador: nativo y Lit', slug: 'guias/contador' },
            { label: 'Ejercicio: restablecer', slug: 'ejercicios/contador' },
            { label: 'Recursos de aprendizaje', slug: 'guias/recursos' },
          ],
        },
        {
          label: 'Capítulos',
          items: [
            {
              label: '01 · Using Web Components',
              items: [
                {
                  slug: 'capitulos/01-using-web-components',
                  label: 'Mapa del capítulo',
                },
                {
                  autogenerate: {
                    directory: 'capitulos/01-using-web-components',
                  },
                },
              ],
            },
            {
              label: '02 · Defining Web Components',
              items: [
                {
                  slug: 'capitulos/02-defining-web-components',
                  label: 'Mapa del capítulo',
                },
                {
                  autogenerate: {
                    directory: 'capitulos/02-defining-web-components',
                  },
                },
              ],
            },
            ...[
              '03-atributos-propiedades',
              '04-shadow-dom',
              '05-slots-composicion',
              '06-eventos',
              '07-formularios',
              '08-lit-fundamentos',
              '09-lit-reactividad',
              '10-lit-composicion',
              '11-ingenieria-produccion',
            ].map((slug) => ({ slug: `capitulos/${slug}` })),
          ],
        },
      ],
    }),
  ],
});
