import { WebComponent } from '../core/index.js';

export default class MyList extends WebComponent {
  attributeChanged() {
    this.render();
  }

  get properties() {
    return {
      list: JSON.parse(`${this.getAttribute('list')}`) ?? [],
    };
  }

  render() {
    this.fragment.innerHTML = `
      <ul>
        ${this.properties.list.map((item: string) => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }
}

customElements.define('my-list', MyList);
