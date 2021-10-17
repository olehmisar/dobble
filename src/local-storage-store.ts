import {
  get,
  readable as internalReadable,
  writable as internalWritable,
} from "svelte/store";

type Start<T> = (set: (value: T) => void) => void | (() => void);

export function persistentWritable<T>(
  key: string,
  initialValue: T,
  start?: Start<T>
) {
  const store = internalWritable(
    readStorage<T>(key) ?? initialValue,
    start && wrapStart(key, start)
  );
  const { subscribe, set } = store;
  return {
    set(value: T) {
      updateStorage(key, value);
      set(value);
    },
    update(cb: (value: T) => T) {
      const value = cb(get(store));
      updateStorage(key, value);
      set(value);
    },
    subscribe,
  };
}

export function persistentReadable<T>(
  key: string,
  initialValue: T,
  start: Start<T>
) {
  const store = internalReadable(
    readStorage<T>(key) ?? initialValue,
    wrapStart(key, start)
  );
  const { subscribe } = store;
  return {
    subscribe,
  };
}

function wrapStart<T>(key: string, start: Start<T>): Start<T> {
  return (set: (value: T) => void) => {
    function wrappedSet(value: T) {
      updateStorage(key, value);
      set(value);
    }
    return start(wrappedSet);
  };
}

function readStorage<T>(key: string): T | null {
  const json = localStorage.getItem(key);
  if (json == null) {
    return null;
  }
  return JSON.parse(json);
}

function updateStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
