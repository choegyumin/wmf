import { WebComponent } from '../core/index.js';

export default class MyCounter extends WebComponent {
  state = this.defineState({
    count: 0,
  });

  #onUpClick() {
    this.state.count += 1;
  }

  stateChanged(name: string, oldValue: unknown, newValue: unknown) {
    console.log(this.tagName, 'stateChanged', { name, oldValue, newValue });
  }

  updated() {
    this.setEventListener('[part="up"]', 'click', this.#onUpClick);
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
