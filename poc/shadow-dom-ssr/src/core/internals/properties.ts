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

export const attributeToProperty = <T = unknown>(
  value: string | null,
  converter: FromAttribute<T>,
): T | string | null => {
  if (typeof converter === 'function') return converter(value);
  return value;
};

export const propertyToAttribute = <T = unknown>(value: T, converter: ToAttribute<T>): string | null => {
  if (typeof converter === 'function') return converter(value);
  if (value == null) return null;
  return String(value);
};
