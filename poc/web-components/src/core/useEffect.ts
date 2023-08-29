import type { EffectCallback, EffectDeps } from './internals/hooks.js';
import { HOOKS_ORDER_CHANGED_MESSAGE, Hook, hooksStore, initializeHook } from './internals/hooks.js';

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

export default function useEffect(callback: EffectCallback, deps?: EffectDeps) {
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
    const cleanup = effect?.(component);
    if (cleanup instanceof Function) {
      component.cleanups.push(cleanup);
      item.cleanup = cleanup;
    }
    item.deps = deps;
  });
}
