import hash from "hash.js";

export function iife<R>(f: () => R): R {
  return f();
}

export function sha256(value: string | number) {
  return parseInt(hash.sha256().update(value.toString()).digest("hex"), 16);
}
