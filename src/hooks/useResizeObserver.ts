import {useEffect, useState} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

// eslint-disable-next-line no-unused-vars
type SingleResizeEntryCallback = (entry: ResizeObserverEntry) => void;

const callbackMap = new WeakMap<Element, SingleResizeEntryCallback>();

const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    const callback = callbackMap.get(entry.target);
    if (callback) {
      callback(entry);
    }
  });
});

/**
 *
 * @param element
 * @param callback
 */
function observe(element: Element | null, callback: SingleResizeEntryCallback) {
  if (element) {
    callbackMap.set(element, callback);
    ro.observe(element);
  }
}

/**
 *
 * @param element
 */
function unobserve(element: Element | null) {
  if (element) {
    callbackMap.delete(element);
    ro.unobserve(element);
  }
}

export function useResizeObserver<T extends HTMLElement>() {
  const [element, setElementRef] = useState<T | null>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);

  const [offsetWidth, setOffsetWidth] = useState(0);

  useEffect(() => {
    observe(element, (entry) => {
      setHeight(entry.contentRect.height);
      setWidth(entry.contentRect.width);

      const divEntry = entry.target as HTMLElement;
      setClientWidth(divEntry.clientWidth);
      setScrollWidth(divEntry.scrollWidth);
      setOffsetWidth(divEntry.offsetWidth);
    });
    return () => {
      unobserve(element);
    };
  }, [element]);
  return {height, width, setElementRef, element, scrollWidth, offsetWidth, clientWidth};
}
