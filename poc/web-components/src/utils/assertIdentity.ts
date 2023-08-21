export default function assertIdentity<T>() {
  return function identity<P extends T>(input: P): P {
    return input;
  };
}
