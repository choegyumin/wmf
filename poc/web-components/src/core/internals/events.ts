/** @see HTMLElement.addEventListener */
export type EventListenerConfig = {
  targets: Node[];
  type: string;
  listener: EventListener;
  options?: AddEventListenerOptions;
};
