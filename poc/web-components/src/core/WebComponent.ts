export default abstract class WebComponent extends HTMLElement {
  constructor() {
    super();

    const internals = this.attachInternals();
    if (!internals.shadowRoot) {
      // If we don't have SSR content, build the shadow root
      this.attachShadow({ mode: 'open' });
    }
  }

  static get observedAttributes(): readonly string[] {
    return [];
  }

  get fragment(): ShadowRoot {
    return this.shadowRoot!;
  }

  connectedCallback(): void {
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks} */
    if (!this.isConnected) return;
    this.render();
  }

  disconnectedCallback(): void {
    this.clear();
  }

  adoptedCallback(): void {}

  attributeChangedCallback(): void {}

  render(): void {}

  clear(): void {}
}
