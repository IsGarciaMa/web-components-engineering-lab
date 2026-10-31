import { LitElement, html, unsafeCSS, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
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

/** Mismo contrato y slots que NativeTabs; Lit conserva la propiedad de su template. */
export class LitTabs extends LitElement {
  // CSS estático del repositorio; nunca proviene del consumidor.
  static override styles = unsafeCSS(tabsStyles);
  readonly #prefix = createTabsId();
  #items: readonly TabItem[] = [];
  #configured = false;
  #selected = '';
  #pendingFocus: HTMLElement | null = null;
  @state() private focusedId = '';

  @property({ attribute: false })
  get items(): readonly TabItem[] {
    return this.#items;
  }
  set items(value: readonly TabItem[]) {
    const next = validateItems(value);
    this.#pendingFocus ??= activeWithin(this);
    this.#items = next;
    this.#configured = true;
    this.selected = resolveSelection(next, this.#selected);
    this.focusedId = resolveSelection(next, this.focusedId || this.selected);
  }

  @property({
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => value ?? '',
      toAttribute: (value: string) => value || null,
    },
  })
  get selected(): string {
    return this.#selected;
  }
  set selected(value: string) {
    const requested = typeof value === 'string' ? value : '';
    const active = activeWithin(this);
    this.#pendingFocus ??= active;
    this.#selected = this.#configured
      ? resolveSelection(this.items, requested)
      : requested;
    const activeId =
      active?.closest<HTMLButtonElement>('[role="tab"]')?.dataset['id'] ?? '';
    this.focusedId = isEnabled(this.items, activeId)
      ? activeId
      : this.#selected;
  }

  override attributeChangedCallback(
    name: string,
    previous: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, previous, value);
    // Tras super, Lit ya terminó su guard de reflexión atributo → propiedad.
    // Solicita corregir también una entrada inválida normalizada al mismo ID.
    if (
      name === 'selected' &&
      this.#configured &&
      this.getAttribute('selected') !== (this.selected || null)
    ) {
      this.requestUpdate('selected', undefined);
    }
  }

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({
    type: String,
    converter: {
      fromAttribute: (value: string | null) => value ?? 'Secciones',
    },
  })
  label = 'Secciones';

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('disabled')) {
      this.#pendingFocus ??= activeWithin(this);
    }
  }

  protected override updated(): void {
    const previous = this.#pendingFocus;
    this.#pendingFocus = null;
    restoreTabsFocus(this, previous, this.selected);
  }

  private buttonFrom(event: Event): HTMLButtonElement | null {
    const button =
      event.target instanceof Element
        ? event.target.closest('button[role="tab"]')
        : null;
    return button instanceof HTMLButtonElement &&
      this.renderRoot.contains(button)
      ? button
      : null;
  }

  private onFocus(event: Event): void {
    const button = this.buttonFrom(event);
    if (button && !button.disabled) {
      this.focusedId = button.dataset['id'] ?? '';
    }
  }

  private onClick(event: Event): void {
    if (!this.isConnected) {
      return;
    }
    const button = this.buttonFrom(event);
    if (!button || button.disabled) {
      return;
    }
    this.focusedId = button.dataset['id'] ?? '';
    this.activate(this.focusedId, 'pointer');
  }

  private onKeydown(event: KeyboardEvent): void {
    if (!this.isConnected) {
      return;
    }
    const button = this.buttonFrom(event);
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
      this.renderRoot
        .querySelector<HTMLButtonElement>(`#${this.#prefix}-tab-${next}`)
        ?.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.activate(id, 'keyboard');
    }
  }

  private activate(id: string, source: SelectionSource): void {
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

  private renderTab(item: TabItem) {
    return html`<button
      type="button"
      role="tab"
      data-id=${item.id}
      id=${`${this.#prefix}-tab-${item.id}`}
      aria-controls=${`${this.#prefix}-panel-${item.id}`}
      aria-selected=${String(this.selected === item.id)}
      ?disabled=${this.disabled || item.disabled}
      tabindex=${!this.disabled && !item.disabled && this.focusedId === item.id
        ? 0
        : -1}
    >
      ${item.label}
    </button>`;
  }

  private renderPanel(item: TabItem) {
    return html`<div
      role="tabpanel"
      id=${`${this.#prefix}-panel-${item.id}`}
      aria-labelledby=${`${this.#prefix}-tab-${item.id}`}
      tabindex="0"
      ?hidden=${this.selected !== item.id}
    >
      <slot name=${item.id}>Panel sin contenido asignado.</slot>
    </div>`;
  }

  protected override render() {
    return html`<div
        role="tablist"
        aria-label=${this.label || 'Secciones'}
        aria-orientation="horizontal"
        ?hidden=${!this.items.length}
        @click=${this.onClick}
        @keydown=${this.onKeydown}
        @focusin=${this.onFocus}
      >
        ${repeat(
          this.items,
          (item) => item.id,
          (item) => this.renderTab(item),
        )}
      </div>
      ${repeat(
        this.items,
        (item) => item.id,
        (item) => this.renderPanel(item),
      )}
      <p
        data-empty
        tabindex="-1"
        ?hidden=${Boolean(this.selected && this.items.length)}
      >
        No hay pestañas disponibles.
      </p>`;
  }
}

if (!customElements.get('lab-lit-tabs')) {
  customElements.define('lab-lit-tabs', LitTabs);
}
declare global {
  interface HTMLElementTagNameMap {
    'lab-lit-tabs': LitTabs;
  }
}
