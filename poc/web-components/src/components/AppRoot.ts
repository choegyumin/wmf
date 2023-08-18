import './MyButton.js';
import { WebComponent } from '../core/index.js';

export default class AppRoot extends WebComponent {
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
      </div>
    `;
    this.addEventListeners();
  }
}

customElements.define('app-root', AppRoot);
