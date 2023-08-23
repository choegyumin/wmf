import { createWebComponent, P } from '../core/index.js';

const propertiesType = {
  color: P.string,
};

const MyToggle = createWebComponent(propertiesType, function (properties) {
  const { color = 'black' } = properties;

  return `
    <style>
      :host [part="toggle"] {
        color: ${color};
      }
      :host [part="toggle"][aria-pressed="true"] {
        box-shadow: inset 1px 1px 1px rgba(0, 0, 0, .2);
      }
    </style>
    <button part="toggle">
      <slot></slot>
    </button>
  `;
});

customElements.define('my-toggle', MyToggle);

export default MyToggle;
