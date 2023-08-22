import './MyButton.js';
import './MyCounter.js';
import './MyList.js';
import { WebComponent } from '../core/index.js';

export default class AppRoot extends WebComponent {
  list = [0, 1, 2, 3, 4];

  get helloNode() {
    return this.fragment.querySelector<HTMLElement>(':host [part="hello"]');
  }

  #onHelloClick = () => {
    alert('Hi');
  };

  addEventListeners() {
    this.helloNode?.addEventListener('click', this.#onHelloClick);
  }

  removeEventListeners() {
    this.helloNode?.removeEventListener('click', this.#onHelloClick);
  }

  disconnected() {
    this.removeEventListeners();
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
        <my-list list='${JSON.stringify(this.list)}'></my-list>
      </div>
    `;
    this.addEventListeners();
  }
}

customElements.define('app-root', AppRoot);
