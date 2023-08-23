import CustomComponent from './CustomComponent.js';
import { switchComponent } from './hooks.js';
import type { CleanupCallback, EffectCallback, Properties, PropertiesType } from './types.js';

export type WebComponentFunction<P extends {}> = {
  (this: HookComponent, properties: P): string;
  displayName?: string;
};

export interface CreateWebComponentOptions {
  componentName?: string;
}

export abstract class HookComponent extends CustomComponent {
  renderer: WebComponentFunction<any> = () => '';
  effects: EffectCallback[] = [];
  cleanups: CleanupCallback[] = [];

  render() {
    switchComponent(this);
    return this.renderer(this.properties);
  }

  connected() {
    this.cleanups = [];
  }

  disconnected() {
    this.cleanups.forEach((callback) => callback(this));
  }

  willUpdate() {
    this.effects = [];
  }

  updated() {
    this.effects.forEach((callback) => callback(this));
  }
}

export default function createWebComponent<T extends PropertiesType<any>, P extends {} = Properties<T>>(
  propertiesType: T,
  component: WebComponentFunction<P>,
  options: CreateWebComponentOptions = {},
) {
  const { componentName = component.displayName || component.name } = options;

  const Constructor = class extends HookComponent {
    static propertiesType = propertiesType;
    properties = {} as P;
    renderer = component;
  };

  // For debugging purposes
  if (componentName) {
    Object.defineProperty(Constructor, 'name', {
      value: componentName,
    });
  }

  return Constructor;
}
