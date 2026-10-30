import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
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
          label: '11 capítulos',
          items: [{ autogenerate: { directory: 'capitulos' } }],
        },
      ],
    }),
  ],
});
