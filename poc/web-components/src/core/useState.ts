import type { SetState } from './internals/hooks.js';
import { HOOKS_ORDER_CHANGED_MESSAGE, Hook, hooksStore, initializeHook } from './internals/hooks.js';

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

export default function useState<S>(initialState: S | (() => S)): [S, SetState<S>] {
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
