import HookComponent from '../components/HookComponent.js';

export type EffectCallback = (component: HookComponent) => void | (() => void);
export type EffectDeps = unknown[];

export type CleanupCallback = (component: HookComponent) => void;

export type SetState<S> = (state: S | ((prevState: S) => S)) => void;

export const HOOK_CALLED_FROM_OUTSIDE_COMPONENT_MESSAGE = 'Hook must be called inside a component.';
export const HOOKS_ORDER_CHANGED_MESSAGE = 'Detected a change in the order of Hooks.';

export abstract class Hook {
  static is(object: unknown): object is Hook {
    return object instanceof Hook;
  }
}

let instance: HookComponent | null = null;
let hookIndex: number = 0;

export const hooksStore = new WeakMap<HookComponent, Record<number, Hook>>();

export function switchComponent(component: HookComponent) {
  instance = component;
  hookIndex = 0;
  if (!hooksStore.has(instance)) hooksStore.set(component, []);
}

export function initializeHook() {
  if (instance == null) throw new Error(HOOK_CALLED_FROM_OUTSIDE_COMPONENT_MESSAGE);
  const meta = { component: instance, hookIndex };
  hookIndex += 1;
  return meta;
}
