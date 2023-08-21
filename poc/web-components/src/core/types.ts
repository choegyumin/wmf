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
