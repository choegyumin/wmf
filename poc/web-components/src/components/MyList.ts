import { P, WebComponent } from '../core/index.js';

export default class MyList extends WebComponent {
  static propertiesType = {
    list: P.Array,
  };

  /**
   * If you need to validate the type while declaring 'properties', you can use the following approach:
   * @example
   * ```ts
   * properties = assertIdentity<Properties<typeof MyList.propertiesType>>()({
   *   list: ['default'],
   * });
   * ```
   */
  properties = {
    list: ['default'],
  };

  propertyChanged(name: string, oldValue: unknown, newValue: unknown) {
    console.log(this.tagName, 'propertyChanged', { name, oldValue, newValue });
    this.render();
  }

  render() {
    this.fragment.innerHTML = `
      <ul>
        ${this.properties.list.map((item) => `<li>${String(item)}</li>`).join('')}
      </ul>
    `;
  }
}

customElements.define('my-list', MyList);
