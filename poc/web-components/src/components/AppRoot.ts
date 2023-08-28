import './MyButton.js';
import './MyCounter.js';
import './MyList.js';
import { WebComponent } from '../core/index.js';

export default class AppRoot extends WebComponent {
  state = this.defineState({
    list: [0, 1, 2, 3, 4],
  });

  get helloNode() {
    return this.fragment.querySelector<HTMLElement>(':host [part="hello"]');
  }

  get addNode() {
    return this.fragment.querySelector<HTMLElement>(':host [part="add"]');
  }

  get batchAddNode() {
    return this.fragment.querySelector<HTMLElement>(':host [part="batchAdd"]');
  }

  #onHelloClick = () => {
    alert('Hi');
  };

  #onAddClick = () => {
    this.state.list = [...this.state.list, this.state.list.length];
  };

  #onBatchAddClick = () => {
    for (let i = 0; i < 1000; i += 1) {
      this.state.list = [0];
      for (let j = 1; j < 10; j += 1) {
        this.state.list = [...this.state.list, this.state.list.length];
      }
    }
  };

  addEventListeners() {
    this.helloNode?.addEventListener('click', this.#onHelloClick);
    this.addNode?.addEventListener('click', this.#onAddClick);
    this.batchAddNode?.addEventListener('click', this.#onBatchAddClick);
  }

  removeEventListeners() {
    this.helloNode?.removeEventListener('click', this.#onHelloClick);
    this.addNode?.removeEventListener('click', this.#onAddClick);
    this.batchAddNode?.removeEventListener('click', this.#onBatchAddClick);
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
