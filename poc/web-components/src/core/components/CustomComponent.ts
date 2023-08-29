import CustomElement from './CustomElement.js';
import type { Properties, PropertiesType } from '../internals/properties.js';
import { attributeToProperty, propertyToAttribute } from '../internals/properties.js';
import { updateChildNodes } from '../../utils/index.js';

const propertyGetter: (...args: Parameters<typeof Reflect.get>) => unknown = Reflect.get;
const propertySetter: (...args: Parameters<typeof Reflect.set>) => boolean = Reflect.set;

export default abstract class CustomComponent extends CustomElement {
  #defaultProperties: Properties<{}> = {};
  properties: Properties<{}> = {};

  constructor() {
    super();

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
    return (this.constructor as typeof CustomComponent).propertiesType;
  }

  #resetDefaultProperties(): void {
    this.#defaultProperties = { ...this.properties };
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

  /** Force an update immediately. This may cause unexpected behavior. */
  performUpdate(): void {
    if (!this.isInitialized) this.#resetDefaultProperties();
    this.willUpdate();
    const html = this.render();
    if (this.fragment.innerHTML.trim() === '') this.fragment.innerHTML = html;
    else updateChildNodes(this.fragment, html);
    this.updated();
  }

  getProperty(name: string): unknown {
    return propertyGetter(this.properties, name);
  }

  setProperty(name: string, value: unknown): void {
    if (!Object.hasOwn(this.#propertiesType, name)) return;
    this.#reflectToAttribute(name, value);
  }

  hasProperty(name: string): boolean {
    return Object.hasOwn(this.#propertiesType, name) && propertyGetter(this.properties, name) !== undefined;
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
    this.update();
  }

  render(): string {
    return '';
  }

  propertyChanged(name: string, oldValue: unknown, newValue: unknown): void {}
  willUpdate(): void {}
  updated(): void {}
}
