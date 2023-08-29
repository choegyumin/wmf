import CustomElement from './CustomElement.js';
import { Route } from '../internals/routes.js';
import setInnerHTML from '../../utils/setInnerHTML.js';

export abstract class RouterElement extends CustomElement {
  routes: Route[] = [];

  render() {
    const { pathname } = location;
    const route = this.routes.find(({ path }) => (path instanceof RegExp ? path.test(pathname) : path === pathname));
    if (route == null) console.warn(`No routes matched location "${pathname}"`);
    setInnerHTML(this.fragment, route?.html ?? '');
  }

  connected() {
    window.addEventListener('popstate', () => {
      this.performUpdate();
    });
  }
}
