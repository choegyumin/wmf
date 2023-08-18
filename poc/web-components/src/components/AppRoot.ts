import './MyButton.js';

export default class AppRoot extends HTMLElement {
  get helloNode() {
    return this.querySelector<HTMLElement>('[part="hello"]');
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

  connectedCallback() {
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks} */
    if (!this.isConnected) return;
    this.render();
  }

  disconnectedCallback() {
    this.clear();
  }

  render() {
    this.removeEventListeners();
    this.innerHTML = `
      <div>
        <my-button part="hello">Hello</my-button>, World!
      </div>
    `;
    this.addEventListeners();
  }

  clear() {
    this.removeEventListeners();
  }
}

customElements.define('app-root', AppRoot);
