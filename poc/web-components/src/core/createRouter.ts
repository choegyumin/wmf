import CustomElement from './CustomElement.js';
import { Route } from './types.js';
import setInnerHTML from '../utils/setInnerHTML.js';

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

export default function createRouter(routes: Route[]) {
  const Constructor = class extends RouterElement {
    routes = routes;
  };

  return Constructor;
}
