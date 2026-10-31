export interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export type SelectionSource = 'pointer' | 'keyboard';
export interface TabChangeDetail {
  readonly previous: string;
  readonly selected: string;
  readonly source: SelectionSource;
}

export interface TabsAPI extends HTMLElement {
  items: readonly TabItem[];
  selected: string;
  disabled: boolean;
  label: string;
}

let nextInstance = 0;
export function createTabsId(): string {
  return `lab-tabs-${++nextInstance}`;
}

/** Copia defensiva: IDs únicos estables, etiquetas de texto y booleanos reales. */
export function validateItems(value: readonly TabItem[]): readonly TabItem[] {
  if (!Array.isArray(value)) {
    throw new TypeError('items debe ser un array.');
  }
  const ids = new Set<string>();
  const items = value.map((item: TabItem) => {
    if (
      !item ||
      typeof item.id !== 'string' ||
      !/^[a-z][a-z0-9-]*$/.test(item.id) ||
      ids.has(item.id) ||
      typeof item.label !== 'string' ||
      !item.label.trim() ||
      (item.disabled !== undefined && typeof item.disabled !== 'boolean')
    ) {
      throw new TypeError(
        'Cada tab necesita id único en kebab-case, label no vacío y disabled booleano.',
      );
    }
    ids.add(item.id);
    return Object.freeze({
      id: item.id,
      label: item.label,
      disabled: item.disabled ?? false,
    });
  });
  return Object.freeze(items);
}

export function isEnabled(items: readonly TabItem[], id: string): boolean {
  return items.some((item) => item.id === id && !item.disabled);
}

export function resolveSelection(
  items: readonly TabItem[],
  requested: string,
): string {
  return isEnabled(items, requested)
    ? requested
    : (items.find((item) => !item.disabled)?.id ?? '');
}

export function navigationTarget(
  items: readonly TabItem[],
  current: string,
  key: string,
  rtl: boolean,
): string | undefined {
  const enabled = items.filter((item) => !item.disabled);
  if (!enabled.length) {
    return undefined;
  }
  if (key === 'Home') {
    return enabled[0]?.id;
  }
  if (key === 'End') {
    return enabled.at(-1)?.id;
  }
  if (key !== 'ArrowRight' && key !== 'ArrowLeft') {
    return undefined;
  }
  const index = Math.max(
    0,
    enabled.findIndex((item) => item.id === current),
  );
  const step = (key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1);
  return enabled[(index + step + enabled.length) % enabled.length]?.id;
}

export function beforeTabChange(
  host: HTMLElement,
  detail: TabChangeDetail,
): boolean {
  return host.dispatchEvent(
    new CustomEvent<TabChangeDetail>('before-tab-change', {
      detail: Object.freeze({ ...detail }),
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );
}

export function emitTabChange(
  host: HTMLElement,
  detail: TabChangeDetail,
): void {
  host.dispatchEvent(
    new CustomEvent<TabChangeDetail>('tab-change', {
      detail: Object.freeze({ ...detail }),
      bubbles: true,
      composed: true,
    }),
  );
}

/** Recorre raíces abiertas: document.activeElement puede ser un host exterior. */
export function activeWithin(host: HTMLElement): HTMLElement | null {
  let active = host.ownerDocument.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  if (
    active instanceof HTMLElement &&
    (host.contains(active) || host.shadowRoot?.contains(active))
  ) {
    return active;
  }
  return null;
}

/** Conserva foco existente; solo recupera foco perdido, deshabilitado u ocultado. */
export function restoreTabsFocus(
  host: HTMLElement,
  previous: HTMLElement | null,
  selected: string,
): void {
  if (!previous || !host.isConnected) {
    return;
  }
  const root = host.shadowRoot;
  if (!root) {
    return;
  }
  const hiddenInternal = Boolean(previous.closest('[hidden]'));
  let child: HTMLElement | null = previous;
  while (child && child.parentElement !== host) {
    child = child.parentElement;
  }
  const hiddenSlotted = host.contains(previous) && child?.slot !== selected;
  const disabledButton =
    previous instanceof HTMLButtonElement && previous.disabled;
  const stillOwned = host.contains(previous) || root.contains(previous);
  if (
    previous.isConnected &&
    stillOwned &&
    !hiddenInternal &&
    !hiddenSlotted &&
    !disabledButton
  ) {
    if (activeWithin(host) !== previous) {
      previous.focus();
    }
    return;
  }
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const target =
    buttons.find(
      (button) => button.dataset['id'] === selected && !button.disabled,
    ) ??
    buttons.find((button) => !button.disabled) ??
    root.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])') ??
    root.querySelector<HTMLElement>('[data-empty]');
  target?.focus();
}

/** CSS local estático compartido para comparar comportamiento y no temas distintos. */
export const tabsStyles = `
  :host { display: block; min-inline-size: 0; font: inherit; color: inherit; }
  [role="tablist"] { display: flex; flex-wrap: wrap; gap: .35rem; padding: .4rem;
    border-block-end: 2px solid var(--lab-line, currentColor); }
  button { font: inherit; color: inherit; background: var(--lab-surface, transparent);
    border: 1px solid currentColor; border-radius: .4rem; padding: .6rem .8rem;
    min-block-size: 44px; max-inline-size: 100%; overflow-wrap: anywhere; cursor: pointer; }
  button[aria-selected="true"] { border-block-end: 4px solid var(--lab-accent, currentColor); font-weight: 700; }
  button:disabled { cursor: default; opacity: .6; }
  [role="tabpanel"] { padding: 1rem; overflow-wrap: anywhere; border: 1px solid var(--lab-line, currentColor); }
  [hidden] { display: none !important; }
  :focus-visible { outline: 3px solid var(--lab-accent, currentColor); outline-offset: 3px; }
  [data-empty] { padding: 1rem; }
  @media (forced-colors: active) {
    button, [role="tabpanel"], [role="tablist"] { border-color: CanvasText; }
    button[aria-selected="true"] { border-block-end-color: Highlight; }
  }
`;
