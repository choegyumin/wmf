import { WebComponent } from '../core/index.js';

export default class MyCounter extends WebComponent {
  state = {
    count: 0,
  };

  get upNode() {
    return this.fragment.querySelector<HTMLElement>(':host [part="up"]');
  }

  #onUpClick = () => {
    if (this.upNode == null) return;
    this.state.count += 1;
    this.upNode.innerHTML = `${this.state.count}`;
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

  render() {
    this.removeEventListeners();
    this.fragment.innerHTML = `
      <button part="up">
        ${this.state.count}
      </button>
    `;
    this.addEventListeners();
  }
}

customElements.define('my-counter', MyCounter);
