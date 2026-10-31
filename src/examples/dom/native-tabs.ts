import {
  activeWithin,
  beforeTabChange,
  createTabsId,
  emitTabChange,
  isEnabled,
  navigationTarget,
  resolveSelection,
  restoreTabsFocus,
  tabsStyles,
  validateItems,
  type SelectionSource,
  type TabItem,
} from './tabs-contract';

interface TabNodes {
  button: HTMLButtonElement;
  panel: HTMLDivElement;
}

/** items (propiedad), selected/disabled/label (propiedad y atributo). Activación manual. */
export class NativeTabs extends HTMLElement {
  static observedAttributes = ['selected', 'disabled', 'label'];
  readonly #prefix = createTabsId();
  readonly #list = document.createElement('div');
  readonly #panels = document.createElement('div');
  readonly #empty = document.createElement('p');
  readonly #nodes = new Map<string, TabNodes>();
  #items: readonly TabItem[] = [];
  #configured = false;
  #selected = '';
  #focused = '';

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = tabsStyles;
    this.#list.setAttribute('role', 'tablist');
    this.#list.setAttribute('aria-orientation', 'horizontal');
    this.#empty.textContent = 'No hay pestañas disponibles.';
    this.#empty.dataset['empty'] = '';
    this.#empty.tabIndex = -1;
    root.append(style, this.#list, this.#panels, this.#empty);
  }

  get items(): readonly TabItem[] {
    return this.#items;
  }
  set items(value: readonly TabItem[]) {
    const next = validateItems(value);
    const active = activeWithin(this);
    this.#items = next;
    this.#configured = true;
    this.#selected = resolveSelection(next, this.#selected);
    this.#focused = resolveSelection(next, this.#focused || this.#selected);
    this.#reflectSelected();
    this.#reconcile();
    this.#syncState();
    restoreTabsFocus(this, active, this.#selected);
  }

  get selected(): string {
    return this.#selected;
  }
  set selected(value: string) {
    const requested = typeof value === 'string' ? value : '';
    const active = activeWithin(this);
    this.#selected = this.#configured
      ? resolveSelection(this.items, requested)
      : requested;
    const focusedTab = active?.closest<HTMLButtonElement>('[role="tab"]');
    const activeId = focusedTab?.dataset['id'] ?? '';
    this.#focused = isEnabled(this.items, activeId) ? activeId : this.#selected;
    this.#reflectSelected();
    this.#syncState();
    restoreTabsFocus(this, active, this.#selected);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    this.toggleAttribute('disabled', Boolean(value));
  }

  get label(): string {
    return this.getAttribute('label') ?? 'Secciones';
  }
  set label(value: string) {
    this.setAttribute('label', value);
  }

  connectedCallback(): void {
    for (const key of ['items', 'selected', 'disabled', 'label'] as const) {
      this.#upgradeProperty(key);
    }
    this.#list.addEventListener('click', this.#onClick);
    this.#list.addEventListener('keydown', this.#onKeydown);
    this.#list.addEventListener('focusin', this.#onFocus);
    this.#syncState();
  }

  disconnectedCallback(): void {
    this.#list.removeEventListener('click', this.#onClick);
    this.#list.removeEventListener('keydown', this.#onKeydown);
    this.#list.removeEventListener('focusin', this.#onFocus);
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    // Respeta asignaciones propias anteriores al upgrade; se recuperan al conectar.
    if (Object.hasOwn(this, name)) {
      return;
    }
    if (name === 'selected') {
      this.selected = value ?? '';
      return;
    }
    const active = activeWithin(this);
    this.#syncState();
    restoreTabsFocus(this, active, this.selected);
  }

  #upgradeProperty<K extends 'items' | 'selected' | 'disabled' | 'label'>(
    key: K,
  ): void {
    if (!Object.hasOwn(this, key)) {
      return;
    }
    const value = this[key];
    Reflect.deleteProperty(this, key);
    this[key] = value;
  }

  #reflectSelected(): void {
    if (!this.#selected) {
      if (this.hasAttribute('selected')) {
        this.removeAttribute('selected');
      }
      return;
    }
    if (this.getAttribute('selected') !== this.#selected) {
      this.setAttribute('selected', this.#selected);
    }
  }

  #reconcile(): void {
    const ids = new Set(this.items.map((item) => item.id));
    for (const [id, nodes] of this.#nodes) {
      if (!ids.has(id)) {
        nodes.button.remove();
        nodes.panel.remove();
        this.#nodes.delete(id);
      }
    }
    this.items.forEach((item, index) => {
      let nodes = this.#nodes.get(item.id);
      if (!nodes) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset['id'] = item.id;
        button.id = `${this.#prefix}-tab-${item.id}`;
        button.setAttribute('role', 'tab');
        const panel = document.createElement('div');
        panel.id = `${this.#prefix}-panel-${item.id}`;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', button.id);
        panel.tabIndex = 0;
        button.setAttribute('aria-controls', panel.id);
        const slot = document.createElement('slot');
        slot.name = item.id;
        slot.textContent = 'Panel sin contenido asignado.';
        panel.append(slot);
        nodes = { button, panel };
        this.#nodes.set(item.id, nodes);
      }
      nodes.button.textContent = item.label;
      if (this.#list.children[index] !== nodes.button) {
        this.#list.insertBefore(
          nodes.button,
          this.#list.children[index] ?? null,
        );
      }
      if (this.#panels.children[index] !== nodes.panel) {
        this.#panels.insertBefore(
          nodes.panel,
          this.#panels.children[index] ?? null,
        );
      }
    });
  }

  #syncState(): void {
    this.#list.setAttribute('aria-label', this.label || 'Secciones');
    this.#list.hidden = this.items.length === 0;
    this.#empty.hidden = Boolean(this.#selected && this.items.length);
    for (const item of this.items) {
      const nodes = this.#nodes.get(item.id);
      if (!nodes) {
        continue;
      }
      nodes.button.disabled = this.disabled || Boolean(item.disabled);
      nodes.button.tabIndex =
        !nodes.button.disabled && item.id === this.#focused ? 0 : -1;
      nodes.button.setAttribute(
        'aria-selected',
        String(item.id === this.#selected),
      );
      nodes.panel.hidden = item.id !== this.#selected;
    }
  }

  #buttonFrom(event: Event): HTMLButtonElement | null {
    const button =
      event.target instanceof Element
        ? event.target.closest('button[role="tab"]')
        : null;
    return button instanceof HTMLButtonElement && this.#list.contains(button)
      ? button
      : null;
  }

  readonly #onFocus = (event: Event): void => {
    const button = this.#buttonFrom(event);
    if (button && !button.disabled) {
      this.#focused = button.dataset['id'] ?? '';
      this.#syncState();
    }
  };

  readonly #onClick = (event: Event): void => {
    const button = this.#buttonFrom(event);
    if (!button || button.disabled) {
      return;
    }
    this.#focused = button.dataset['id'] ?? '';
    this.#syncState();
    this.#activate(this.#focused, 'pointer');
  };

  readonly #onKeydown = (event: KeyboardEvent): void => {
    const button = this.#buttonFrom(event);
    if (
      !button ||
      button.disabled ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }
    const id = button.dataset['id'] ?? '';
    const next = navigationTarget(
      this.items,
      id,
      event.key,
      getComputedStyle(this).direction === 'rtl',
    );
    if (next) {
      event.preventDefault();
      this.#nodes.get(next)?.button.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#activate(id, 'keyboard');
    }
  };

  #activate(id: string, source: SelectionSource): void {
    if (this.disabled || !isEnabled(this.items, id) || id === this.selected) {
      return;
    }
    const detail = { previous: this.selected, selected: id, source };
    if (
      !beforeTabChange(this, detail) ||
      this.selected !== detail.previous ||
      this.disabled ||
      !isEnabled(this.items, id)
    ) {
      return;
    }
    this.selected = id;
    emitTabChange(this, detail);
  }
}

if (!customElements.get('lab-native-tabs')) {
  customElements.define('lab-native-tabs', NativeTabs);
}
declare global {
  interface HTMLElementTagNameMap {
    'lab-native-tabs': NativeTabs;
  }
}
