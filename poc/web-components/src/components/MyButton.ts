import { WebComponent } from '../core/index.js';

export default class MyButton extends WebComponent {
  render() {
    this.fragment.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('my-button', MyButton);
