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

  willUpdate() {
    this.removeEventListeners();
  }

  updated() {
    this.addEventListeners();
  }

  disconnected() {
    this.removeEventListeners();
  }

  stateChanged(name: string, oldValue: unknown, newValue: unknown) {
    console.log(this.tagName, 'stateChanged', { name, oldValue, newValue });
  }

  render() {
    return `
      <button part="up">
        <strong>
          ${this.state.count}
        </strong>
      </button>
    `;
  }
}

customElements.define('my-counter', MyCounter);
