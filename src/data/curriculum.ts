import { definingLessons, definingLessonHref } from './defining-web-components';
import { usingLessons, usingLessonHref } from './using-web-components';

export type EditorialStatus = 'pending' | 'available' | 'in-progress';

export const statusLabels: Record<EditorialStatus, string> = {
  pending: 'Pendiente',
  available: 'Disponible',
  'in-progress': 'En desarrollo',
};

export interface Chapter {
  slug: string;
  title: string;
  description: string;
  stage: 'Estándares web' | 'Ingeniería con Lit' | 'Calidad y entrega';
  status: EditorialStatus;
  objectives: readonly string[];
}

// El índice conserva el orden original. Publicar recursos de PR-00 no publica un capítulo.
export const chapters: readonly Chapter[] = [
  {
    slug: '01-using-web-components',
    title: 'Using Web Components',
    description:
      'Consume, personaliza e integra componentes en siete lecciones prácticas.',
    stage: 'Estándares web',
    status: 'available',
    objectives: [
      'Consumir bibliotecas y reconocer sus contratos públicos.',
      'Personalizar con tokens y partes sin modificar el Shadow DOM.',
      'Integrar propiedades, eventos y renderizado cliente con criterio.',
    ],
  },
  {
    slug: '02-defining-web-components',
    title: 'Defining Web Components',
    description:
      'Define componentes nativos y compara sus responsabilidades con Lit.',
    stage: 'Estándares web',
    status: 'available',
    objectives: [
      'Registrar un elemento con una API pública.',
      'Gestionar conexión, desconexión y upgrade.',
    ],
  },
  {
    slug: '03-atributos-propiedades',
    title: 'Atributos, propiedades y contratos',
    description:
      'Diseña entradas predecibles para quienes usan tus componentes.',
    stage: 'Estándares web',
    status: 'pending',
    objectives: [
      'Convertir y reflejar valores con reglas explícitas.',
      'Verificar valores iniciales y entradas inválidas.',
    ],
  },
  {
    slug: '04-shadow-dom',
    title: 'Shadow DOM y encapsulación',
    description:
      'Comprende los límites del árbol y del estilo de un componente.',
    stage: 'Estándares web',
    status: 'pending',
    objectives: [
      'Elegir entre Shadow DOM y Light DOM.',
      'Definir una superficie de personalización con CSS.',
    ],
  },
  {
    slug: '05-slots-composicion',
    title: 'Slots y composición del DOM',
    description: 'Compón interfaces respetando la propiedad de los nodos.',
    stage: 'Estándares web',
    status: 'pending',
    objectives: [
      'Distribuir contenido con slots y fallback.',
      'Observar cambios sin duplicar nodos del consumidor.',
    ],
  },
  {
    slug: '06-eventos',
    title: 'Eventos y comunicación',
    description: 'Conecta componentes a través de contratos observables.',
    stage: 'Estándares web',
    status: 'pending',
    objectives: [
      'Diseñar payloads y nombres de eventos.',
      'Distinguir bubbles, composed y retargeting.',
    ],
  },
  {
    slug: '07-formularios',
    title: 'Formularios y ElementInternals',
    description: 'Integra elementos personalizados con formularios nativos.',
    stage: 'Estándares web',
    status: 'pending',
    objectives: [
      'Participar en envío, reset y restauración.',
      'Relacionar valor, validación y accesibilidad.',
    ],
  },
  {
    slug: '08-lit-fundamentos',
    title: 'LitElement y templates',
    description: 'Añade templates declarativos sin abandonar los estándares.',
    stage: 'Ingeniería con Lit',
    status: 'pending',
    objectives: [
      'Distinguir LitElement del estándar Custom Elements.',
      'Usar bindings de propiedades, atributos y eventos.',
    ],
  },
  {
    slug: '09-lit-reactividad',
    title: 'Reactividad y ciclo de actualización',
    description: 'Razona sobre estado y actualizaciones asíncronas.',
    stage: 'Ingeniería con Lit',
    status: 'pending',
    objectives: [
      'Modelar propiedades públicas y estado interno.',
      'Verificar rendering con updateComplete.',
    ],
  },
  {
    slug: '10-lit-composicion',
    title: 'Directives, Controllers y Context',
    description: 'Comparte comportamiento cuando el caso de uso lo requiere.',
    stage: 'Ingeniería con Lit',
    status: 'pending',
    objectives: [
      'Elegir una herramienta de composición por su necesidad.',
      'Gestionar recursos ligados al ciclo de vida.',
    ],
  },
  {
    slug: '11-ingenieria-produccion',
    title: 'Accesibilidad, calidad y producción',
    description:
      'Lleva los contratos del componente a una entrega verificable.',
    stage: 'Calidad y entrega',
    status: 'pending',
    objectives: [
      'Comprobar teclado, foco y estados accesibles.',
      'Combinar pruebas y un proceso de entrega reproducible.',
    ],
  },
];

export const foundationLesson = {
  id: 'foundation-counter',
  title: 'Un contrato, dos contadores',
  href: '/guias/contador/',
} as const;

export const publishedLessons = [
  foundationLesson,
  ...usingLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    href: usingLessonHref(lesson.slug),
  })),
  ...definingLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    href: definingLessonHref(lesson.slug),
  })),
];
