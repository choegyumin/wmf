import CustomComponent from './CustomComponent.js';
import type { EventListenerConfig, State } from './types.js';

export default abstract class LifecycleComponent extends CustomComponent {
  state: State = {};
  #events: EventListenerConfig[] = [];

  #invalidateEvents(): void {
    this.#events.forEach(({ targets, type, listener, options }) => {
      targets.forEach((target) => target.removeEventListener(type, listener, options));
    });
    this.#events = [];
  }

  /** Force an update immediately. This may cause unexpected behavior. */
  performUpdate(): void {
    this.#invalidateEvents();
    super.performUpdate();
  }

  defineState<S extends typeof this.state>(state: S): S {
    return new Proxy(state, {
      set: (target, prop, newValue, receiver) => {
        const oldValue = target[prop as keyof S];
        const result = Reflect.set(target, prop, newValue, receiver);
        this.stateChangedCallback(prop as string, oldValue, newValue);
        return result;
      },
    });
  }

  setEventListener<K extends keyof HTMLElementEventMap>(
    selector: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | null,
    type: K,
    listener: (this: HTMLElement, event: HTMLElementEventMap[K]) => any,
    options?: EventListenerConfig['options'],
  ): void;
  setEventListener(
    selector: string | Node | Node[] | NodeList | null,
    type: EventListenerConfig['type'],
    listener: EventListenerConfig['listener'],
    options?: EventListenerConfig['options'],
  ): void {
    const targets = (() => {
      if (typeof selector === 'string') return [...this.fragment.querySelectorAll(`:host ${selector}`)];
      if (selector instanceof NodeList) return [...selector];
      if (selector instanceof Node) return [selector];
      return selector ?? [];
    })();
    const listenerFn = listener.bind(this);
    targets.forEach((target) => target.addEventListener(type, listenerFn, options));
    this.#events.push({ targets, type, listener: listenerFn, options });
  }

  /** @deprecated This is an internal implementation. Use `disconnected` instead. */
  disconnectedCallback(): void {
    this.#invalidateEvents();
    super.disconnectedCallback();
  }

  /** @deprecated This is an internal implementation. Use `stateChanged` instead. */
  stateChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    if (oldValue === newValue) return;
    if (!this.isInitialized) return;
    this.stateChanged(name, oldValue, newValue);
    this.update();
  }

  stateChanged(name: string, oldValue: unknown, newValue: unknown): void {}
}
