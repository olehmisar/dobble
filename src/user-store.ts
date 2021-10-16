import { writable } from "svelte/store";

export const username = writable<string | undefined>(undefined);
