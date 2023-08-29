import useEffect from './useEffect.js';
import { EventListenerConfig } from './internals/events.js';

export default function useEventListener<K extends keyof HTMLElementEventMap>(
  selector: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | null,
  type: K,
  listener: (this: HTMLElement, event: HTMLElementEventMap[K]) => any,
  options?: EventListenerConfig['options'],
): void;
export default function useEventListener(
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
