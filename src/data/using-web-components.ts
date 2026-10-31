export const usingChapterHref = '/capitulos/01-using-web-components/';

export const usingLessons = [
  {
    id: 'using-libraries',
    slug: '01-bibliotecas',
    title: 'Consumir bibliotecas',
    minutes: 20,
    lab: 'bibliotecas',
    outcome: 'Instala, registra y utiliza una biblioteca real.',
  },
  {
    id: 'using-theming',
    slug: '02-temas',
    title: 'Diseñar temas con tokens',
    minutes: 20,
    lab: 'temas',
    outcome: 'Cambia tokens heredados sin abrir el Shadow DOM.',
  },
  {
    id: 'using-styling',
    slug: '03-personalizacion',
    title: 'Personalizar con CSS Parts',
    minutes: 25,
    lab: 'parts',
    outcome: 'Distingue tokens, partes, slots y límites de estilo.',
  },
  {
    id: 'using-undefined',
    slug: '04-elementos-no-definidos',
    title: 'Antes y después del registro',
    minutes: 20,
    lab: 'registro',
    outcome: 'Observa el upgrade conservando contenido útil.',
  },
  {
    id: 'using-javascript',
    slug: '05-javascript',
    title: 'Interactuar desde JavaScript',
    minutes: 30,
    lab: 'inspector',
    outcome: 'Inspecciona atributos, propiedades, métodos y eventos.',
  },
  {
    id: 'using-frameworks',
    slug: '06-frameworks',
    title: 'Integrar con frameworks',
    minutes: 30,
    lab: 'frameworks',
    outcome: 'Comprueba React y Astro; compara Angular y Vue.',
  },
  {
    id: 'using-rendering',
    slug: '07-renderizado',
    title: 'Renderizar y mejorar en cliente',
    minutes: 25,
    lab: 'renderizado',
    outcome: 'Entrega HTML útil antes de registrar el elemento.',
  },
] as const;

export type UsingLesson = (typeof usingLessons)[number];
export type UsingLabKind = UsingLesson['lab'] | 'eventos';
export function usingLessonHref(slug: string): string {
  return `${usingChapterHref}${slug}/`;
}
