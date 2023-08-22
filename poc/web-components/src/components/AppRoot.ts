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

  #onHelloClick = () => {
    alert('Hi');
  };

  #onAddClick = () => {
    this.state.list = [...this.state.list, this.state.list.length];
  };

  addEventListeners() {
    this.helloNode?.addEventListener('click', this.#onHelloClick);
    this.addNode?.addEventListener('click', this.#onAddClick);
  }

  removeEventListeners() {
    this.helloNode?.removeEventListener('click', this.#onHelloClick);
    this.addNode?.removeEventListener('click', this.#onAddClick);
  }

  disconnected() {
    this.removeEventListeners();
  }

  stateChanged() {
    this.render();
  }

  render() {
    this.removeEventListeners();
    this.fragment.innerHTML = `
      <div>
        <my-button part="hello">Hello</my-button>, World!
        <hr>
        <h2>State</h2>
        <my-counter></my-counter>
        <hr>
        <h2>Properties</h2>
        <my-button part="add">+</my-button>
        <my-list list='${JSON.stringify(this.state.list)}'></my-list>
      </div>
    `;
    this.addEventListeners();
  }
}

customElements.define('app-root', AppRoot);
