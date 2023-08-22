import { P, WebComponent } from '../core/index.js';
import { updateChildNodes } from '../utils/index.js';

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
    const html = `
      <ul>
        ${this.properties.list
          .map((item) => `<li key="${item}"><input type="text" placeholder="${item}" /></li>`)
          .reverse()
          .join('')}
      </ul>
    `;
    if (this.fragment.innerHTML.trim() === '') this.fragment.innerHTML = html;
    else updateChildNodes(this.fragment, html);
  }
}

customElements.define('my-list', MyList);
