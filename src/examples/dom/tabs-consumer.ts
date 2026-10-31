import type { TabsAPI, TabChangeDetail, TabItem } from './tabs-contract';

export const sampleTabs: readonly TabItem[] = [
  { id: 'intro', label: 'Introducción' },
  { id: 'contract', label: 'Contrato' },
  { id: 'events', label: 'Eventos' },
];

/** Consumidor con contrato público: no escribe en la raíz del componente. */
export function connectTabs(
  tabs: TabsAPI,
  onSelection: (detail: TabChangeDetail) => void,
): () => void {
  tabs.items = sampleTabs;
  const onChange = (event: Event): void => {
    if (!(event instanceof CustomEvent)) {
      return;
    }
    const detail: unknown = event.detail;
    if (
      typeof detail === 'object' &&
      detail !== null &&
      'selected' in detail &&
      typeof detail.selected === 'string' &&
      'previous' in detail &&
      typeof detail.previous === 'string' &&
      'source' in detail &&
      (detail.source === 'pointer' || detail.source === 'keyboard')
    ) {
      onSelection({
        selected: detail.selected,
        previous: detail.previous,
        source: detail.source,
      });
    }
  };
  tabs.addEventListener('tab-change', onChange);
  return () => tabs.removeEventListener('tab-change', onChange);
}
