import { attributeToProperty, propertyToAttribute } from './PropertyConverter.js';
import type { Properties, PropertiesType, State } from './types.js';

const propertyGetter: (...args: Parameters<typeof Reflect.get>) => unknown = Reflect.get;
const propertySetter: (...args: Parameters<typeof Reflect.set>) => boolean = Reflect.set;

export default abstract class WebComponent extends HTMLElement {
  #initialized: boolean = false;
  #defaultProperties: Properties<{}> = {};
  properties: Properties<{}> = {};
  state: State = {};

  constructor() {
    super();

    const internals = this.attachInternals();
    if (!internals.shadowRoot) {
      // If we don't have SSR content, build the shadow root
      this.attachShadow({ mode: 'open' });
    }

    // Reflection (Type inference is not supported)
    Object.keys(this.#propertiesType).forEach((name) => {
      Object.defineProperty(this, name, {
        get() {
          return this.getAttribute(name);
        },
        set(value: unknown) {
          this.setAttribute(name, value);
        },
      });
    });
  }

  /** @deprecated This is an internal implementation. Use `propertiesType` instead. */
  static get observedAttributes(): readonly string[] {
    return Object.keys(this.propertiesType);
  }

  static propertiesType: PropertiesType<any> = {};

  get #propertiesType(): PropertiesType<unknown> {
    /** @see {@link https://github.com/microsoft/TypeScript/issues/3841} */
    return (this.constructor as typeof WebComponent).propertiesType;
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

  #changeProprety(name: string, value: unknown = propertyGetter(this.#defaultProperties, name)) {
    const oldValue = propertyGetter(this.properties, name);
    propertySetter(this.properties, name, value);
    this.propertyChangedCallback(name, oldValue, value);
  }

  /** @see {@link https://web.dev/custom-elements-v1/#reflectattr} */
  #reflectToAttribute(name: string, property: unknown): void {
    const converter = this.#propertiesType[name]?.to;
    const attribute = propertyToAttribute(property, converter);
    // Call `attributeChangedCallback`
    if (attribute == null) this.removeAttribute(name);
    else this.setAttribute(name, attribute);
  }

  /** @see {@link https://web.dev/custom-elements-v1/#reflectattr} */
  #reflectToProperty(name: string, attribute: string | null): void {
    const converter = this.#propertiesType[name]?.from;
    const property = attributeToProperty(attribute, converter);
    this.#changeProprety(name, property);
  }

  #initialize(): void {
    this.#defaultProperties = { ...this.properties };
    /**
     * Lifecycle callbacks may be called before `connectedCallback`.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks}
     * @see {@link https://mdn.github.io/web-components-examples/life-cycle-callbacks/}
     */
    queueMicrotask(() => {
      this.#initialized = true;
    });
  }

  getProperty(name: string): unknown {
    return propertyGetter(this.properties, name);
  }

  setProperty(name: string, value: unknown): void {
    if (Object.hasOwn(this.#propertiesType, name)) this.#reflectToAttribute(name, value);
  }

  hasProperty(name: string): boolean {
    return Object.hasOwn(this.#propertiesType, name) && propertyGetter(this.properties, name) !== undefined;
  }

  defineState<S extends typeof this.state>(state: S): S {
    return new Proxy(state, {
      set: (target, prop, newValue, receiver) => {
        const oldValue = target[prop as keyof S];
        const result = Reflect.set(target, prop, newValue, receiver);
        this.stateChangedCallback(prop as string, oldValue, newValue);
        return result;
      },
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

  /** @deprecated This is an internal implementation. Use `propertyChanged` instead. */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.#reflectToProperty(name, newValue);
  }

  /** @deprecated This is an internal implementation. Use `propertyChanged` instead. */
  propertyChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    if (oldValue === newValue) return;
    if (!this.isInitialized) return;
    this.propertyChanged(name, oldValue, newValue);
  }

  /** @deprecated This is an internal implementation. Use `stateChanged` instead. */
  stateChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    if (oldValue === newValue) return;
    if (!this.isInitialized) return;
    this.stateChanged(name, oldValue, newValue);
  }

  render(): void {}

  connected(): void {}
  disconnected(): void {}
  adopted(): void {}
  propertyChanged(name: string, oldValue: unknown, newValue: unknown): void {}
  stateChanged(name: string, oldValue: unknown, newValue: unknown): void {}
}
