import CustomComponent from './CustomComponent.js';
import type { CleanupCallback, EffectCallback } from '../internals/hooks.js';
import { switchComponent } from '../internals/hooks.js';

export type WebComponentFunction<P extends {}> = {
  (this: HookComponent, properties: P): string;
  displayName?: string;
};

export default abstract class HookComponent extends CustomComponent {
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
