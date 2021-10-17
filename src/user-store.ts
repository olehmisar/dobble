import firebase from "firebase";
import { readable, writable } from "svelte/store";

export const username = writable<string | undefined>(undefined);

firebase
  .auth()
  .signInAnonymously()
  .catch((error) => {
    console.error(error);
  });

export const playerId = readable<string | undefined>(undefined, (set) => {
  firebase
    .auth()
    .onAuthStateChanged((user) => set(user ? user.uid : undefined));
});
