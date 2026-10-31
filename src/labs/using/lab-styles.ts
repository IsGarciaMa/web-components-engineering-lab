import { css } from 'lit';
export const labStyles = css`
  :host {
    display: block;
    font: inherit;
    color: var(--lab-ink);
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 1rem;
    margin-block-end: 1.5rem;
  }
  label {
    display: grid;
    gap: 0.4rem;
    font-weight: 600;
  }
  label.check {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  input,
  select,
  button {
    font: inherit;
  }
  input:not([type='checkbox']),
  select {
    min-block-size: 44px;
    max-inline-size: 100%;
    box-sizing: border-box;
    border: 1px solid currentColor;
    border-radius: 0.35rem;
    padding: 0.4rem 0.6rem;
    background: var(--sl-color-bg);
    color: inherit;
  }
  button {
    min-block-size: 44px;
    border: 1px solid currentColor;
    padding: 0.6rem 0.9rem;
    border-radius: 0.4rem;
    color: var(--lab-accent);
    background: var(--lab-surface);
    cursor: pointer;
  }
  button:disabled {
    cursor: default;
    opacity: 0.6;
  }
  :focus-visible {
    outline: 3px solid var(--lab-accent);
    outline-offset: 4px;
  }
  p {
    line-height: 1.7;
  }
  pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    padding: 1rem;
    border: 1px solid var(--lab-line);
    border-radius: 0.5rem;
    font-size: 0.85rem;
  }
  .pair {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
    gap: 1rem;
  }
  [role='status'] {
    min-block-size: 2em;
    overflow-wrap: anywhere;
  }
  @media (forced-colors: active) {
    button,
    pre,
    input,
    select {
      border-color: CanvasText;
    }
  }
`;
