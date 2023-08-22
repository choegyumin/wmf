import { WebComponent } from '../core/index.js';
import { updateChildNodes } from '../utils/index.js';

export default class MyButton extends WebComponent {
  render() {
    const html = `
      <button>
        <slot></slot>
      </button>
    `;
    if (this.fragment.innerHTML.trim() === '') this.fragment.innerHTML = html;
    else updateChildNodes(this.fragment, html);
  }
}

customElements.define('my-button', MyButton);
