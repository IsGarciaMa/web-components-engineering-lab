import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import type {
  LifecycleProbe,
  LifecycleEntry,
} from '../../examples/defining/lifecycle-probe';
import '../../examples/defining/lifecycle-probe';
import { labStyles } from '../using/lab-styles';

export class LifecycleLab extends LitElement {
  static override styles = [
    labStyles,
    css`
      .mount {
        min-block-size: 4rem;
        border: 1px dashed currentColor;
        padding: 0.75rem;
      }
      .activity {
        max-block-size: 22rem;
        overflow: auto;
        overflow-wrap: anywhere;
        padding-inline-start: 2rem;
      }
      .activity li {
        padding-block: 0.4rem;
      }
    `,
  ];
  @state() private entries: readonly LifecycleEntry[] = [];
  @state() private exists = false;
  @state() private connected = false;
  @state() private message = 'Crea una instancia para empezar.';
  @state() private label = 'Sonda';
  readonly #mount = createRef<HTMLDivElement>();
  readonly #destination = createRef<HTMLDivElement>();
  #probe: LifecycleProbe | undefined;

  readonly #readActivity = (): void => {
    this.entries = this.#probe?.activity ?? [];
    this.connected = this.#probe?.isConnected ?? false;
  };

  private create(): void {
    this.dispose();
    this.#probe = document.createElement('lab-lifecycle-probe');
    this.#probe.addEventListener('lifecycle-activity', this.#readActivity);
    this.exists = true;
    this.#readActivity();
    this.message =
      'Instancia creada y desconectada. El constructor ya se ejecutó.';
  }

  private connect(): void {
    if (!this.#probe) {
      return;
    }
    this.#mount.value?.append(this.#probe);
    this.#readActivity();
    this.message = 'Conectada al documento actual.';
  }

  private disconnect(): void {
    this.#probe?.remove();
    this.#readActivity();
    this.message =
      'Desconectada. Puedes emitir una señal para comprobar la limpieza.';
  }

  private changeAttribute(): void {
    this.#probe?.setAttribute('label', this.label);
    this.#readActivity();
  }

  private ping(): void {
    window.dispatchEvent(new Event('lab-probe-ping'));
    this.message = `Señales recibidas por la sonda: ${this.#probe?.pingCount ?? 0}. Solo debe aumentar mientras esté conectada.`;
  }

  private move(): void {
    const destination = this.#destination.value;
    if (!destination || !this.#probe) {
      return;
    }
    if (
      'moveBefore' in destination &&
      typeof destination.moveBefore === 'function'
    ) {
      destination.moveBefore(this.#probe, null);
      this.message =
        'Se llamó a moveBefore; consulta los callbacks realmente recibidos.';
    } else {
      this.message =
        'moveBefore no está disponible aquí. El movimiento clásico sigue disponible.';
    }
    this.#readActivity();
  }

  private classicMove(): void {
    if (this.#probe) {
      const destination =
        this.#probe.parentNode === this.#mount.value
          ? this.#destination.value
          : this.#mount.value;
      destination?.append(this.#probe);
      this.#readActivity();
    }
  }

  private adopt(): void {
    if (!this.#probe) {
      return;
    }
    // Documento inerte, sin iframe ni ventana: provoca adopción real, no simulada.
    const otherDocument = document.implementation.createHTMLDocument(
      'Destino de adopción',
    );
    otherDocument.adoptNode(this.#probe);
    this.#readActivity();
    this.message =
      'Adoptada en otro Document inerte; desconectada. Conectar la devuelve al documento actual.';
  }

  private dispose(): void {
    this.#probe?.removeEventListener('lifecycle-activity', this.#readActivity);
    this.#probe?.remove();
    this.#probe = undefined;
  }

  private reset(): void {
    this.dispose();
    this.entries = [];
    this.exists = false;
    this.connected = false;
    this.message = 'Laboratorio reiniciado. El registro del nombre permanece.';
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.reset();
  }

  protected override render() {
    return html`<div class="controls">
        <button type="button" @click=${this.create}>Crear instancia</button>
        <button
          type="button"
          ?disabled=${!this.exists || this.connected}
          @click=${this.connect}
        >
          Conectar
        </button>
        <button
          type="button"
          ?disabled=${!this.connected}
          @click=${this.disconnect}
        >
          Desconectar
        </button>
        <label
          >Atributo label<input
            maxlength="80"
            .value=${this.label}
            @input=${(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.label = event.target.value;
              }
            }}
        /></label>
        <button
          type="button"
          ?disabled=${!this.exists}
          @click=${this.changeAttribute}
        >
          Aplicar atributo
        </button>
        <button type="button" ?disabled=${!this.exists} @click=${this.ping}>
          Emitir señal externa
        </button>
        <button
          type="button"
          ?disabled=${!this.connected}
          @click=${this.classicMove}
        >
          Mover con append
        </button>
        <button type="button" ?disabled=${!this.connected} @click=${this.move}>
          Mover con moveBefore
        </button>
        <button type="button" ?disabled=${!this.exists} @click=${this.adopt}>
          Adoptar en otro documento
        </button>
        <button type="button" @click=${this.reset}>
          Reiniciar laboratorio
        </button>
      </div>
      <div class="pair">
        <div>
          <p>Destino inicial</p>
          <div class="mount" ${ref(this.#mount)}></div>
        </div>
        <div>
          <p>Destino de movimiento</p>
          <div class="mount" ${ref(this.#destination)}></div>
        </div>
      </div>
      <p role="status">${this.message}</p>
      <p>
        ${this.entries.length} entradas; máximo 20. Cada fila procede de un
        callback real. La señal externa no es un callback de lifecycle.
      </p>
      <ol class="activity" aria-label="Registro de callbacks" tabindex="0">
        ${this.entries.map(
          (entry) =>
            html`<li value=${entry.sequence}>
              <strong>${entry.callback}</strong> · ${entry.detail}
            </li>`,
        )}
      </ol>`;
  }
}
if (!customElements.get('lab-lifecycle-lab')) {
  customElements.define('lab-lifecycle-lab', LifecycleLab);
}
