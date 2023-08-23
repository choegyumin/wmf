import './MyButton.js';
import './MyCounter.js';
import './MyList.js';
import { WebComponent } from '../core/index.js';

export default class AppRoot extends WebComponent {
  state = this.defineState({
    list: [0, 1, 2, 3, 4],
  });

  #onHelloClick() {
    alert('Hi');
  }

  #onAddClick() {
    this.state.list = [...this.state.list, this.state.list.length];
  }

  #onBatchAddClick() {
    for (let i = 0; i < 1000; i += 1) {
      this.state.list = [0];
      for (let j = 1; j < 10; j += 1) {
        this.state.list = [...this.state.list, this.state.list.length];
      }
    }
  }

  updated() {
    this.setEventListener('[part="hello"]', 'click', this.#onHelloClick);
    this.setEventListener('[part="add"]', 'click', this.#onAddClick);
    this.setEventListener('[part="batchAdd"]', 'click', this.#onBatchAddClick);
  }

  render() {
    return `
    <div>
      <my-button part="hello">Hello</my-button>, World!
      <hr>
      <h2>State</h2>
      <my-counter></my-counter>
      <hr>
      <h2>Properties</h2>
      <my-button part="add">+</my-button>
      <my-button part="batchAdd">+++</my-button>
        <my-list list='${JSON.stringify(this.state.list)}'></my-list>
      </div>
    `;
  }
}

customElements.define('app-root', AppRoot);
