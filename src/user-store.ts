import firebase from "firebase";
import { readable } from "svelte/store";
import { persistentWritable } from "./local-storage-store";

export const username = persistentWritable<string | undefined>(
  "username",
  undefined
);

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
