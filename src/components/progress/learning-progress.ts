import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { foundationLesson } from '../../data/curriculum';

const storageKey = 'lab-learning-progress-v1';

export class LearningProgress extends LitElement {
  @property({ attribute: 'lesson-id' }) lessonId = '';
  @state() private enabled = false;
  @state() private completed = false;
  @state() private message = '';

  static override styles = css`
    :host {
      display: block;
      margin-block: 1.5rem;
      color: var(--sl-color-text);
      font: inherit;
    }
    section {
      border: 1px solid var(--sl-color-gray-5);
      border-radius: 0.8rem;
      background: var(--lab-surface);
      padding: 1.25rem;
    }
    h2 {
      margin: 0;
      font-size: 1.1rem;
    }
    p {
      line-height: 1.6;
      margin-block: 0.65rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    button {
      min-block-size: 44px;
      border: 1px solid currentColor;
      border-radius: 0.4rem;
      background: transparent;
      color: var(--sl-color-text-accent);
      padding: 0.6rem 0.85rem;
      font: inherit;
      cursor: pointer;
    }
    button:focus-visible,
    a:focus-visible {
      outline: 3px solid var(--sl-color-text-accent);
      outline-offset: 4px;
    }
    a {
      color: var(--sl-color-text-accent);
    }
    progress {
      inline-size: 100%;
      accent-color: var(--sl-color-text-accent);
    }
    [role='status'] {
      margin-block-end: 0;
    }
    @media (forced-colors: active) {
      section,
      button {
        border-color: CanvasText;
      }
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const data: unknown = JSON.parse(saved);
      if (
        typeof data !== 'object' ||
        data === null ||
        !('version' in data) ||
        data.version !== 1 ||
        !('completed' in data) ||
        typeof data.completed !== 'boolean'
      ) {
        this.message =
          'Los datos guardados no son válidos. Puedes activar el progreso de nuevo.';
        return;
      }
      this.enabled = true;
      this.completed = data.completed;
    } catch {
      this.message =
        'No se ha podido leer el progreso local. El contenido sigue disponible.';
    }
  }

  private save(completed: boolean): void {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ version: 1, completed }),
      );
      this.enabled = true;
      this.completed = completed;
      this.message = completed
        ? 'Lección marcada como completada en este navegador.'
        : 'Progreso local activado. La lección está pendiente de completar.';
    } catch {
      this.message =
        'No se ha podido guardar. Comprueba los permisos de almacenamiento del navegador.';
    }
  }

  private forget(): void {
    try {
      localStorage.removeItem(storageKey);
      this.enabled = false;
      this.completed = false;
      this.message = 'Progreso borrado y seguimiento desactivado.';
    } catch {
      this.message =
        'No se ha podido borrar. Puedes eliminar los datos del sitio desde tu navegador.';
    }
  }

  protected override render() {
    return html`<section aria-labelledby="progress-title">
      <h2 id="progress-title">Tu progreso, en este navegador</h2>
      <p>
        Opcional y sin cuenta. Se guarda solo en este navegador; no se
        sincroniza entre dispositivos. Incluye la lección inicial disponible, no
        los once capítulos pendientes.
      </p>
      ${this.enabled
        ? html` <progress
              aria-label="Lecciones disponibles completadas"
              value=${Number(this.completed)}
              max="1"
            ></progress>
            <p>${Number(this.completed)} de 1 lección disponible completada.</p>
            <div class="actions">
              ${this.lessonId === foundationLesson.id
                ? html`<button
                    type="button"
                    aria-pressed=${this.completed}
                    @click=${() => this.save(!this.completed)}
                  >
                    ${this.completed
                      ? 'Marcar como pendiente'
                      : 'Marcar lección como completada'}
                  </button>`
                : html`<a href=${foundationLesson.href}
                    >Continuar con la lección inicial →</a
                  >`}
              <button type="button" @click=${this.forget}>
                Borrar y desactivar progreso
              </button>
            </div>`
        : html`<button type="button" @click=${() => this.save(false)}>
            Activar progreso local
          </button>`}
      <p role="status">${this.message}</p>
    </section>`;
  }
}

if (!customElements.get('lab-learning-progress'))
  customElements.define('lab-learning-progress', LearningProgress);
