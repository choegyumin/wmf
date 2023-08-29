import './BarPage.js';
import './FooPage.js';
import './MyButton.js';
import './MyCounter.js';
import './MyList.js';
import './MyToggle.js';
import { createRouter, navigate, WebComponent } from '../core/index.js';

const AppRouter = createRouter([
  { path: '/', html: `<foo-page>` },
  { path: '/bar', html: `<bar-page>` },
]);

export default class AppRoot extends WebComponent {
  state = this.defineState({
    list: [0, 1, 2, 3, 4],
  });

  #onHelloClick() {
    alert('Hi');
  }

  #onFooClick() {
    navigate('/', true);
  }

  #onBarClick() {
    navigate('/bar', true);
  }

  #onAddClick() {
    this.state.list = [...this.state.list, this.state.list.length];
  }

  #onBatchAddClick() {
    for (let i = 0; i < 1000; i += 1) {
      this.state.list = [0];
      for (let j = 1; j < 10; j += 1) {
        this.state.list = [...this.state.list, this.state.list.length];
      }
    }
  }

  updated() {
    this.setEventListener('[part="hello"]', 'click', this.#onHelloClick);
    this.setEventListener('[part="foo"]', 'click', this.#onFooClick);
    this.setEventListener('[part="bar"]', 'click', this.#onBarClick);
    this.setEventListener('[part="add"]', 'click', this.#onAddClick);
    this.setEventListener('[part="batchAdd"]', 'click', this.#onBatchAddClick);
  }

  render() {
    return `
      <div>
        <my-button part="hello">Hello</my-button>, World!
        <hr>
        <h2>Router</h2>
        <my-button part="foo">Foo</my-button>
        <my-button part="bar">Bar</my-button>
        <app-router></app-router>
        <hr>
        <h2>State</h2>
        <my-counter></my-counter>
        <hr>
        <h2>Properties</h2>
        <my-button part="add">+</my-button>
        <my-button part="batchAdd">+++</my-button>
        <my-list list='${JSON.stringify(this.state.list)}'></my-list>
        <hr>
        <h2>Function(Hook) Component</h2>
        <my-toggle>Toggle</my-toggle>
      </div>
    `;
  }
}

customElements.define('app-router', AppRouter);
customElements.define('app-root', AppRoot);
