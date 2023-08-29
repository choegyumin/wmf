import { createWebComponent, useEffect } from '../core/index.js';

const FooPage = createWebComponent({}, function () {
  useEffect(() => {
    console.log(this.tagName, 'effect []');
    return () => console.log(this.tagName, 'cleanup []');
  }, []);

  return `
    <div part="container">
      Foo
    </div>
  `;
});

customElements.define('foo-page', FooPage);

export default FooPage;
