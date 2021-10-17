export function iife<R>(f: () => R): R {
  return f();
}
