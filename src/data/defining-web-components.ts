export const definingChapterHref = '/capitulos/02-defining-web-components/';

export const definingLessons = [
  {
    id: 'defining-autonomous',
    slug: '01-autonomos',
    title: 'Autonomous Custom Elements',
    minutes: 30,
    lab: 'registro',
    outcome: 'Separa definición, creación, upgrade y conexión.',
  },
  {
    id: 'defining-shadow',
    slug: '02-shadow-dom',
    title: 'Shadow DOM',
    minutes: 25,
    lab: 'shadow',
    outcome: 'Elige encapsulación y observa open frente a closed.',
  },
  {
    id: 'defining-slots',
    slug: '03-slots',
    title: 'Slot Composition',
    minutes: 25,
    lab: 'slots',
    outcome: 'Compón contenido sin apropiarte de los nodos.',
  },
  {
    id: 'defining-templates',
    slug: '04-templates',
    title: 'HTML Templates',
    minutes: 25,
    lab: 'templates',
    outcome: 'Clona estructura y asigna datos como texto.',
  },
  {
    id: 'defining-lifecycle',
    slug: '05-lifecycle',
    title: 'Custom Element Lifecycle',
    minutes: 45,
    lab: 'lifecycle',
    outcome: 'Gestiona conexiones repetidas y limpia recursos reales.',
  },
  {
    id: 'defining-attributes',
    slug: '06-atributos',
    title: 'Observed Attributes',
    minutes: 30,
    lab: 'atributos',
    outcome: 'Convierte atributos y diseña setters sin ciclos.',
  },
  {
    id: 'defining-styling',
    slug: '07-styling',
    title: 'Styling',
    minutes: 25,
    lab: 'comparacion',
    outcome: 'Define estilos internos y una API visual estable.',
  },
  {
    id: 'defining-builtins',
    slug: '08-built-ins',
    title: 'Customizable Built-in Elements',
    minutes: 20,
    lab: 'debugging',
    outcome: 'Evalúa extends e is con límites de compatibilidad.',
  },
  {
    id: 'defining-debugging',
    slug: '09-debugging',
    title: 'Debugging Web Components',
    minutes: 30,
    lab: 'debugging',
    outcome: 'Reproduce y localiza errores de registro y composición.',
  },
] as const;

export const definingLabs = [
  {
    slug: 'registro',
    title: 'Registration & Upgrade',
    objective:
      'Comprueba la identidad del host y mejora un fragmento desconectado.',
    module: 'registration-lab',
    example: 'registration-note',
  },
  {
    slug: 'shadow',
    title: 'Shadow DOM Explorer',
    objective: 'Compara open y closed; observa un token heredado.',
    module: 'shadow-lab',
    example: 'shadow-frames',
  },
  {
    slug: 'slots',
    title: 'Slot Composition Playground',
    objective: 'Cambia texto, asignación y fallback sin clonar el contenido.',
    module: 'slots-lab',
    example: 'slot-card',
  },
  {
    slug: 'templates',
    title: 'HTML Template Cloning',
    objective:
      'Clona una estructura constante y comprueba copias independientes.',
    module: 'template-lab',
    example: 'template-stamp',
  },
  {
    slug: 'lifecycle',
    title: 'Lifecycle Visualizer',
    objective: 'Crea, conecta, desconecta, mueve y adopta una sonda real.',
    module: 'lifecycle-lab',
    example: 'lifecycle-probe',
  },
  {
    slug: 'atributos',
    title: 'Attribute & Property Inspector',
    objective:
      'Compara cadenas, números normalizados, eliminación y booleanos.',
    module: 'attributes-lab',
    example: 'native-meter',
  },
  {
    slug: 'comparacion',
    title: 'Native vs Lit Component',
    objective: 'Actualiza el mismo contrato y compara el momento del render.',
    module: 'comparison-lab',
    example: 'lit-meter',
  },
  {
    slug: 'debugging',
    title: 'Debugging Custom Elements',
    objective:
      'Corrige un slot, captura un registro duplicado y prueba un built-in opcional.',
    module: 'debugging-lab',
    example: 'confirm-button',
  },
] as const;

export type DefiningLabKind = (typeof definingLabs)[number]['slug'];

export function definingLessonHref(slug: string): string {
  return `${definingChapterHref}${slug}/`;
}
