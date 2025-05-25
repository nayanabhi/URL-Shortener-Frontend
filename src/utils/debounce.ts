/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebounceFn = (...args: any[]) => void;

export function debounce(func: DebounceFn, delay: number): DebounceFn {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout to call the function after `delay` ms
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
