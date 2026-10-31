export const domChapterHref = '/capitulos/03-working-with-dom/';

export const domLessons = [
  {
    id: 'dom-scaffold',
    slug: '01-scaffolding',
    title: 'Scaffolding a Tabs Component',
    minutes: 30,
    lab: 'tabs',
    outcome: 'Define un contrato accesible antes de decidir su implementación.',
  },
  {
    id: 'dom-host',
    slug: '02-host-dom',
    title: 'Host DOM',
    minutes: 25,
    lab: 'tabs',
    outcome:
      'Distingue host, raíz y contenido del consumidor mediante consultas reales.',
  },
  {
    id: 'dom-attributes',
    slug: '03-attributes',
    title: 'Attributes',
    minutes: 30,
    lab: 'inspector',
    outcome:
      'Serializa entradas y aplica presencia booleana con reglas explícitas.',
  },
  {
    id: 'dom-properties',
    slug: '04-properties',
    title: 'Properties',
    minutes: 35,
    lab: 'inspector',
    outcome:
      'Diseña setters, datos ricos, reflexión y recuperación tras upgrade.',
  },
  {
    id: 'dom-events',
    slug: '05-events',
    title: 'Events',
    minutes: 40,
    lab: 'eventos',
    outcome:
      'Observa propagación, retargeting y cancelación sin simular eventos.',
  },
  {
    id: 'dom-selection',
    slug: '06-selection',
    title: 'Managing Selection',
    minutes: 40,
    lab: 'seleccion',
    outcome: 'Coordina selección, foco, teclado y sincronización sin ciclos.',
  },
  {
    id: 'dom-finishing',
    slug: '07-finishing',
    title: 'Finishing Touches',
    minutes: 30,
    lab: 'tabs',
    outcome:
      'Resuelve contenido dinámico, casos vacíos y restauración de foco.',
  },
  {
    id: 'dom-registries',
    slug: '08-registries',
    title: 'Custom Element Registries',
    minutes: 25,
    lab: 'tabs',
    outcome: 'Diferencia registro global y local y verifica soporte opcional.',
  },
] as const;

export const domLabs = [
  {
    slug: 'tabs',
    title: 'Tabs Component Playground',
    objective:
      'Compara Tabs nativo y Lit y examina sus árboles y contenido dinámico.',
    module: 'playground-lab',
    tag: 'lab-tabs-playground',
  },
  {
    slug: 'inspector',
    title: 'Attribute vs Property Inspector',
    objective:
      'Escribe atributos y propiedades y comprueba el contrato normalizado.',
    module: 'attributes-lab',
    tag: 'lab-tabs-attributes',
  },
  {
    slug: 'eventos',
    title: 'Event Propagation Explorer',
    objective:
      'Observa listeners, fases, retargeting y cancelación de un evento real.',
    module: 'events-lab',
    tag: 'lab-dom-events',
  },
  {
    slug: 'seleccion',
    title: 'Selection State Lab',
    objective:
      'Distingue foco de selección y sincroniza vistas sin reemitir cambios.',
    module: 'selection-lab',
    tag: 'lab-tabs-selection',
  },
] as const;

export type DomLabKind = (typeof domLabs)[number]['slug'];

export function domLessonHref(slug: string): string {
  return `${domChapterHref}${slug}/`;
}
