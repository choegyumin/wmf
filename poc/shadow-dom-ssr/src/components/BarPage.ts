import { createWebComponent, useEffect } from '../core/index.js';

const BarPage = createWebComponent({}, function () {
  useEffect(() => {
    console.log(this.tagName, 'effect []');
    return () => console.log(this.tagName, 'cleanup []');
  }, []);

  return `
    <div part="container">
      Bar
    </div>
  `;
});

customElements.define('bar-page', BarPage);

export default BarPage;
