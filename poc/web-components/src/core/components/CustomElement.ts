export default abstract class CustomElement extends HTMLElement {
  #initialized: boolean = false;
  #updaterID: number = -1;

  constructor() {
    super();

    const internals = this.attachInternals();
    if (!internals.shadowRoot) {
      // If we don't have SSR content, build the shadow root
      this.attachShadow({ mode: 'open' });
    }
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

  update(): void {
    cancelAnimationFrame(this.#updaterID);
    this.#updaterID = requestAnimationFrame(() => {
      if (!this.isInitialized) this.#initialize();
      this.performUpdate();
    });
  }

  /** Force an update immediately. This may cause unexpected behavior. */
  performUpdate(): void {
    this.render();
  }

  /** @deprecated This is an internal implementation. Use `connected` instead. */
  connectedCallback(): void {
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks} */
    if (!this.isConnected) return;
    this.update();
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

  render(): void {}

  connected(): void {}
  disconnected(): void {}
  adopted(): void {}
}
