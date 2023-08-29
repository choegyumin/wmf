import { WebComponent } from '../core/index.js';

export default class MyButton extends WebComponent {
  render() {
    return `
      <button>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('my-button', MyButton);
