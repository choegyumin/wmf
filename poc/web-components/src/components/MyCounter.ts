import { WebComponent } from '../core/index.js';
import { updateChildNodes } from '../utils/index.js';

export default class MyCounter extends WebComponent {
  state = this.defineState({
    count: 0,
  });

  get upNode() {
    return this.fragment.querySelector<HTMLElement>(':host [part="up"]');
  }

  #onUpClick = () => {
    this.state.count += 1;
  };

  addEventListeners() {
    this.upNode?.addEventListener('click', this.#onUpClick);
  }

  removeEventListeners() {
    this.upNode?.removeEventListener('click', this.#onUpClick);
  }

  disconnected() {
    this.removeEventListeners();
  }

  stateChanged(name: string, oldValue: unknown, newValue: unknown) {
    console.log(this.tagName, 'stateChanged', { name, oldValue, newValue });
    this.render();
  }

  render() {
    this.removeEventListeners();
    const html = `
      <button part="up">
        <strong>
          ${this.state.count}
        </strong>
      </button>
    `;
    if (this.fragment.innerHTML.trim() === '') this.fragment.innerHTML = html;
    else updateChildNodes(this.fragment, html);
    this.addEventListeners();
  }
}

customElements.define('my-counter', MyCounter);
