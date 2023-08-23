import { WebComponent } from '../core/index.js';

export default function Component() {
  return `
    <style>
      :host [part="toggle"] {
        color: black;
      }
      :host [part="toggle"][aria-pressed="true"] {
        box-shadow: inset 1px 1px 1px rgba(0, 0, 0, .2);
      }
    </style>
    <button part="toggle" aria-pressed="true">
      <slot></slot>
    </button>
  `;
}

class MyToggle extends WebComponent {
  render() {
    return Component();
  }
}

customElements.define('my-toggle', MyToggle);
