import { createWebComponent, P, useEffect, useEventListener, useState } from '../core/index.js';

const propertiesType = {
  color: P.string,
};

const MyToggle = createWebComponent(propertiesType, function (properties) {
  const { color = 'black' } = properties;

  const [pressed, setPressed] = useState(false);

  const onButtonClick = () => {
    setPressed(!pressed);
  };

  useEffect(() => {
    console.log(this.tagName, 'effect');
    return () => console.log(this.tagName, 'cleanup');
  });

  useEffect(() => {
    console.log(this.tagName, 'effect []');
    return () => console.log(this.tagName, 'cleanup []');
  }, []);

  useEffect(() => {
    console.log(this.tagName, 'effect [pressed]', { pressed });
    return () => console.log(this.tagName, 'cleanup [pressed]', { pressed });
  }, [pressed]);

  useEventListener('[part="toggle"]', 'click', onButtonClick);

  return `
    <style>
      :host [part="toggle"] {
        color: ${color};
      }
      :host [part="toggle"][aria-pressed="true"] {
        box-shadow: inset 1px 1px 1px rgba(0, 0, 0, .2);
      }
    </style>
    <button part="toggle" aria-pressed="${pressed}">
      <slot></slot>
    </button>
  `;
});

customElements.define('my-toggle', MyToggle);

export default MyToggle;
