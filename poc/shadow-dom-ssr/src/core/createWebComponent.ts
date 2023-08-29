import HookComponent, { WebComponentFunction } from './components/HookComponent.js';
import type { Properties, PropertiesType } from './internals/properties.js';

export interface CreateWebComponentOptions {
  componentName?: string;
}

export default function createWebComponent<T extends PropertiesType<any>, P extends {} = Properties<T>>(
  propertiesType: T,
  component: WebComponentFunction<P>,
  options: CreateWebComponentOptions = {},
) {
  const { componentName = component.displayName || component.name } = options;

  const WebComponent = class extends HookComponent {
    static propertiesType = propertiesType;
    properties = {} as P;
    renderer = component;
  };

  // For debugging purposes
  if (componentName) {
    Object.defineProperty(WebComponent, 'name', {
      value: componentName,
    });
  }

  return WebComponent;
}
