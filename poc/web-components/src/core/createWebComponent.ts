import CustomComponent from './CustomComponent.js';
import type { Properties, PropertiesType } from './types.js';

export type WebComponentFunction<P extends {}> = {
  (this: HookComponent, properties: P): string;
  displayName?: string;
};

export interface CreateWebComponentOptions {
  componentName?: string;
}

export abstract class HookComponent extends CustomComponent {}

export default function createWebComponent<T extends PropertiesType<any>, P extends {} = Properties<T>>(
  propertiesType: T,
  component: WebComponentFunction<P>,
  options: CreateWebComponentOptions = {},
) {
  const { componentName = component.displayName || component.name } = options;

  const Constructor = class extends HookComponent {
    static propertiesType = propertiesType;

    properties = {} as P;

    render() {
      return component.call(this as HookComponent, this.properties);
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
