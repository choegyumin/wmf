export default class MyButton extends HTMLElement {
  constructor() {
    super();

    const internals = this.attachInternals();
    if (!internals.shadowRoot) {
      // If we don't have SSR content, build the shadow root
      this.attachShadow({ mode: 'open' });
    }
  }

  get fragment() {
    return this.shadowRoot!;
  }

  connectedCallback() {
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks} */
    if (!this.isConnected) return;
    this.render();
  }

  render() {
    this.fragment.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('my-button', MyButton);
