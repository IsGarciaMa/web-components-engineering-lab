import '../using/reading-card';
import { isLessonSelection } from '../using/selection-contract';

export class AstroConsumer extends HTMLElement {
  connectedCallback(): void {
    this.addEventListener('lesson-select', this.record);
    this.querySelector('[data-set-reader]')?.addEventListener(
      'click',
      this.setReader,
    );
  }
  disconnectedCallback(): void {
    this.removeEventListener('lesson-select', this.record);
    this.querySelector('[data-set-reader]')?.removeEventListener(
      'click',
      this.setReader,
    );
  }
  private readonly setReader = (): void => {
    const card = this.querySelector('lab-reading-card');
    if (card) card.reader = { name: 'Ada desde Astro' };
  };
  private readonly record = (event: Event): void => {
    if (!isLessonSelection(event)) return;
    const status = this.querySelector('[data-astro-status]');
    if (status)
      status.textContent = `Astro recibió lesson-select para ${event.detail.readerName}.`;
  };
}
if (!customElements.get('lab-astro-consumer'))
  customElements.define('lab-astro-consumer', AstroConsumer);
