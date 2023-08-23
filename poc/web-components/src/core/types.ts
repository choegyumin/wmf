import { HookComponent } from './createWebComponent';

export type PropertyType<T = unknown> = {
  from: FromAttribute<T>;
  to: ToAttribute<T>;
};

export type PropertiesType<T = unknown, N extends string = string> = {
  [K in N]: PropertyType<T>;
};

export type Properties<P> = P extends PropertiesType<any, infer N> ? { [K in N]: ReturnType<P[K]['from']> } : never;

export type FromAttribute<T = unknown> = (attribute: string | null) => T | null;
export type ToAttribute<T = unknown> = (property: T | null) => string | null;

export type State<S extends Partial<Record<string, unknown>> = {}> = S;

/** @see HTMLElement.addEventListener */
export type EventListenerConfig = {
  targets: Node[];
  type: string;
  listener: EventListener;
  options?: AddEventListenerOptions;
};

export type EffectCallback = (component: HookComponent) => void | (() => void);
export type EffectDeps = unknown[];

export type CleanupCallback = (component: HookComponent) => void;

export type SetState<S> = (state: S | ((prevState: S) => S)) => void;
