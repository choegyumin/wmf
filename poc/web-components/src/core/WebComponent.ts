export default abstract class WebComponent extends HTMLElement {
  #initialized: boolean = false;

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

  /**
   * Indicates that the DOM node and Component instance are in a usable state. (after construction and first Shadow DOM render)
   * @see isConnected - Indicates whether the DOM node is connected to a Document object.
   */
  get isInitialized(): boolean {
    return this.#initialized;
  }

  #initialize(): void {
    /**
     * Lifecycle callbacks may be called before `connectedCallback`.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks}
     * @see {@link https://mdn.github.io/web-components-examples/life-cycle-callbacks/}
     */
    queueMicrotask(() => {
      this.#initialized = true;
    });
  }

  /** @deprecated This is an internal implementation. Use `connected` instead. */
  connectedCallback(): void {
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks} */
    if (!this.isConnected) return;
    if (!this.isInitialized) this.#initialize();
    this.render();
    this.connected();
  }

  /** @deprecated This is an internal implementation. Use `disconnected` instead. */
  disconnectedCallback(): void {
    this.disconnected();
  }

  /** @deprecated This is an internal implementation. Use `adopted` instead. */
  adoptedCallback(): void {
    this.adopted();
  }

  /** @deprecated This is an internal implementation. Use `attributeChanged` instead. */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (!this.isInitialized) return;
    this.attributeChanged(name, oldValue, newValue);
  }

  render(): void {}

  connected(): void {}
  disconnected(): void {}
  adopted(): void {}
  attributeChanged(name: string, oldValue: string | null, newValue: string | null): void {}
}
