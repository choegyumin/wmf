import { RouterElement } from './components/RouterElement.js';
import { Route } from './internals/routes.js';

export default function createRouter(routes: Route[]) {
  const Constructor = class extends RouterElement {
    routes = routes;
  };

  return Constructor;
}
