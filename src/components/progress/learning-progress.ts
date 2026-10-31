import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { publishedLessons } from '../../data/curriculum';
import {
  legacyProgressKey,
  parseProgress,
  progressStorageKey,
} from './progress-contract';

export class LearningProgress extends LitElement {
  @property({ attribute: 'lesson-id' }) lessonId = '';
  @state() private enabled = false;
  @state() private completedIds: string[] = [];
  private get completed(): boolean {
    return this.completedIds.includes(this.lessonId);
  }
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
      const saved =
        localStorage.getItem(progressStorageKey) ??
        localStorage.getItem(legacyProgressKey);
      if (!saved) return;
      this.completedIds = parseProgress(saved).completedIds;
      this.enabled = true;
    } catch {
      this.message =
        'No se ha podido leer el progreso local. El contenido sigue disponible.';
    }
  }

  private async save(completed: boolean): Promise<void> {
    const wasEnabled = this.enabled;
    try {
      const completedIds =
        this.lessonId && completed
          ? [...new Set([...this.completedIds, this.lessonId])]
          : this.completedIds.filter((id) => id !== this.lessonId);
      localStorage.setItem(
        progressStorageKey,
        JSON.stringify({ version: 2, completedIds }),
      );
      this.enabled = true;
      this.completedIds = completedIds;
      this.message = completed
        ? 'Lección marcada como completada en este navegador.'
        : 'Progreso local activado. La lección está pendiente de completar.';
      if (!wasEnabled) {
        await this.updateComplete;
        if (this.isConnected)
          this.renderRoot
            .querySelector<HTMLElement>('.actions button, .actions a')
            ?.focus();
      }
    } catch {
      this.message =
        'No se ha podido guardar. Comprueba los permisos de almacenamiento del navegador.';
    }
  }

  private async forget(): Promise<void> {
    try {
      localStorage.removeItem(progressStorageKey);
      localStorage.removeItem(legacyProgressKey);
      this.enabled = false;
      this.completedIds = [];
      this.message = 'Progreso borrado y seguimiento desactivado.';
      await this.updateComplete;
      if (this.isConnected)
        this.renderRoot.querySelector<HTMLButtonElement>('button')?.focus();
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
        sincroniza entre dispositivos. Incluye la lección inicial y las
        lecciones publicadas de Using, Defining y Working with the DOM. Los
        capítulos pendientes no cuentan.
      </p>
      ${this.enabled
        ? html` <progress
              aria-label="Lecciones disponibles completadas"
              value=${this.completedIds.length}
              max=${publishedLessons.length}
            ></progress>
            <p>
              ${this.completedIds.length} de ${publishedLessons.length}
              lecciones disponibles completadas.
            </p>
            <div class="actions">
              ${publishedLessons.some((lesson) => lesson.id === this.lessonId)
                ? html`<button
                    type="button"
                    aria-pressed=${this.completed}
                    @click=${() => this.save(!this.completed)}
                  >
                    ${this.completed
                      ? 'Marcar como pendiente'
                      : 'Marcar lección como completada'}
                  </button>`
                : html`<a
                    href=${publishedLessons.find(
                      (lesson) => !this.completedIds.includes(lesson.id),
                    )?.href ?? '/capitulos/01-using-web-components/'}
                    >Continuar aprendiendo →</a
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
