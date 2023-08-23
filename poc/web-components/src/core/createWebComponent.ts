import type { Properties, PropertiesType } from './types.js';
import WebComponent from './WebComponent.js';

export type WebComponentFunction<P extends {}> = {
  (this: WebComponent, properties: P): string;
  displayName?: string;
};

export interface CreateWebComponentOptions {
  componentName?: string;
}

export default function createWebComponent<T extends PropertiesType<any>, P extends {} = Properties<T>>(
  propertiesType: T,
  component: WebComponentFunction<P>,
  options: CreateWebComponentOptions = {},
) {
  const { componentName = component.displayName || component.name } = options;

  const Constructor = class extends WebComponent {
    static propertiesType = propertiesType;

    properties = {} as P;

    render() {
      return component.call(this as WebComponent, this.properties);
    }
  };

  // For debugging purposes
  if (componentName) {
    Object.defineProperty(Constructor, 'name', {
      value: componentName,
    });
  }

  return Constructor;
}
