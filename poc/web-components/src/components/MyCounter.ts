import { WebComponent } from '../core/index.js';

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
    this.fragment.innerHTML = `
      <button part="up">
        <strong>
          ${this.state.count}
        </strong>
      </button>
    `;
    this.addEventListeners();
  }
}

customElements.define('my-counter', MyCounter);
