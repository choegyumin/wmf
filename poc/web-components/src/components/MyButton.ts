export default class MyButton extends HTMLElement {
  connectedCallback() {
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks} */
    if (!this.isConnected) return;
    this.render();
  }

  render() {
    this.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('my-button', MyButton);
