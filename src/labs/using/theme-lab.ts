import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../../examples/using/reading-card';
import { labStyles } from './lab-styles';

export class ThemeLab extends LitElement {
  @state() private theme = 'light';
  @state() private accent = '#08745a';
  @state() private radius = '12';
  static override styles = [
    labStyles,
    css`
      .theme-scope {
        --reader-space: 1.5rem;
        padding: 1rem;
        border-radius: 0.6rem;
      }
      .local {
        --reader-radius: 0;
      }
    `,
  ];
  protected override render() {
    const dark = this.theme === 'dark';
    const tokens = {
      '--reader-accent': this.accent,
      '--reader-radius': `${this.radius}px`,
      '--reader-surface': dark ? '#182225' : '#f0f4ef',
      '--reader-ink': dark ? '#edf5f3' : '#172e30',
    };
    return html`<div class="controls">
        <label
          >Tema de la demo<select
            @change=${(e: Event) => {
              if (e.target instanceof HTMLSelectElement)
                this.theme = e.target.value;
            }}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select></label
        >
        <label
          >Color del borde<input
            type="color"
            value=${this.accent}
            @input=${(e: Event) => {
              if (e.target instanceof HTMLInputElement)
                this.accent = e.target.value;
            }}
        /></label>
        <label
          >Radio (px)<input
            type="range"
            min="0"
            max="32"
            .value=${this.radius}
            @input=${(e: Event) => {
              if (e.target instanceof HTMLInputElement)
                this.radius = e.target.value;
            }}
        /></label>
      </div>
      <div class="theme-scope pair" style=${styleMap(tokens)}>
        <lab-reading-card heading="Tokens heredados"></lab-reading-card>
        <lab-reading-card
          class="local"
          heading="Excepción local: radio cero"
        ></lab-reading-card>
      </div>
      <p role="status">
        Tema ${dark ? 'oscuro' : 'claro'} · borde ${this.accent} · radio
        ${this.radius}px. La segunda tarjeta conserva radio 0.
      </p>`;
  }
}
if (!customElements.get('lab-theme-lab'))
  customElements.define('lab-theme-lab', ThemeLab);
