import type { FromAttribute, ToAttribute } from './types';

const define = <T>(from: FromAttribute<T>, to: ToAttribute<T>) => ({ from, to });

const PropertyConverter = {
  define,
  string: define(
    (attribute) => attribute,
    (property) => property,
  ),
  number: define(
    (attribute) => (attribute != null ? Number(attribute) : null),
    (property) => (property != null ? String(property) : null),
  ),
  boolean: define(
    (attribute) => attribute !== 'false' && Boolean(attribute),
    (property) => (property ? 'true' : null),
  ),
  Array: define(
    (attribute) => (attribute != null ? (JSON.parse(attribute) as Array<unknown>) : null),
    (property) => (property != null ? JSON.stringify(property) : null),
  ),
  Object: define(
    (attribute) => (attribute != null ? (JSON.parse(attribute) as Object) : null),
    (property) => (property != null ? JSON.stringify(property) : null),
  ),
};

export default PropertyConverter;
