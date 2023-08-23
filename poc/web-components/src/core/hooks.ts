import { HookComponent } from './createWebComponent';
import type { EffectCallback, EffectDeps, EventListenerConfig, SetState } from './types';

const HOOK_CALLED_FROM_OUTSIDE_COMPONENT_MESSAGE = 'Hook must be called inside a component.';
const HOOKS_ORDER_CHANGED_MESSAGE = 'Detected a change in the order of Hooks.';

abstract class Hook {
  static is(object: unknown): object is Hook {
    return object instanceof Hook;
  }
}

class StateHook<S = unknown> extends Hook {
  value: S;
  constructor(value: S) {
    super();
    this.value = value;
  }
  static is<S>(object: unknown): object is StateHook<S> {
    return object instanceof StateHook;
  }
}

class EffectHook extends Hook {
  cleanup: EffectCallback | undefined;
  deps?: EffectDeps;
  constructor(cleanup: EffectCallback | undefined, deps?: EffectDeps) {
    super();
    this.cleanup = cleanup;
    this.deps = deps;
  }
  static is(object: unknown): object is EffectHook {
    return object instanceof EffectHook;
  }
}

const HooksManager = (() => {
  let instance: HookComponent | null = null;
  let hookIndex: number = 0;
  const hooksStore = new WeakMap<HookComponent, Record<number, unknown>>();

  function switchComponent(component: HookComponent) {
    instance = component;
    hookIndex = 0;
    if (!hooksStore.has(instance)) hooksStore.set(component, []);
  }

  function initializeHook() {
    if (instance == null) throw new Error(HOOK_CALLED_FROM_OUTSIDE_COMPONENT_MESSAGE);
    const meta = { component: instance, hookIndex };
    hookIndex += 1;
    return meta;
  }

  return { hooksStore, switchComponent, initializeHook };
})();

export const { switchComponent } = HooksManager;
const { hooksStore, initializeHook } = HooksManager;

export function useState<S>(initialState: S | (() => S)): [S, SetState<S>] {
  const { component, hookIndex } = initializeHook();
  const queue = hooksStore.get(component)!;

  const firstrun = !Object.hasOwn(queue, hookIndex);
  if (firstrun) queue[hookIndex] = new StateHook(initialState instanceof Function ? initialState() : initialState);

  const item = queue[hookIndex];
  if (!StateHook.is<S>(item)) throw new Error(HOOKS_ORDER_CHANGED_MESSAGE);

  const setState: SetState<S> = (value) => {
    item.value = value instanceof Function ? value(item.value) : value;
    component.update();
  };

  return [item.value, setState];
}

export function useEffect(callback: EffectCallback, deps?: EffectDeps) {
  const { component, hookIndex } = initializeHook();
  const queue = hooksStore.get(component)!;

  const firstrun = !Object.hasOwn(queue, hookIndex);
  if (firstrun) queue[hookIndex] = new EffectHook(undefined, undefined);

  const item = queue[hookIndex];
  if (!EffectHook.is(item)) throw new Error(HOOKS_ORDER_CHANGED_MESSAGE);

  const { deps: prevDeps, cleanup } = item;
  const effect: EffectCallback | undefined = (() => {
    const getEffect = () => {
      cleanup?.(component);
      return callback;
    };
    if (deps == null || prevDeps == null) return getEffect();
    if (deps.length !== prevDeps.length) return getEffect();
    if (deps.some((item, index) => item !== prevDeps[index])) return getEffect();
  })();

  if (!effect) return;

  component.effects.push(() => {
    const cleanup = effect(component);
    if (cleanup instanceof Function) {
      component.cleanups.push(cleanup);
      item.cleanup = cleanup;
    }
    item.deps = deps;
  });
}

export function useEventListener<K extends keyof HTMLElementEventMap>(
  selector: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | null,
  type: K,
  listener: (this: HTMLElement, event: HTMLElementEventMap[K]) => any,
  options?: EventListenerConfig['options'],
): void;
export function useEventListener(
  selector: string | Node | Node[] | NodeList | null,
  type: EventListenerConfig['type'],
  listener: EventListenerConfig['listener'],
  options?: EventListenerConfig['options'],
): void {
  return useEffect((component) => {
    const targets = (() => {
      if (typeof selector === 'string') return [...component.fragment.querySelectorAll(`:host ${selector}`)];
      if (selector instanceof NodeList) return [...selector];
      if (selector instanceof Node) return [selector];
      return selector ?? [];
    })();
    const listenerFn = listener.bind(component);
    targets.forEach((target) => target.addEventListener(type, listenerFn, options));
    return () => targets.forEach((target) => target.removeEventListener(type, listener, options));
  });
}
