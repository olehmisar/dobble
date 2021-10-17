import firebase from "firebase";
import _ from "lodash";
import { derived, readable, writable } from "svelte/store";
import { persistentWritable } from "./local-storage-store";
import * as typesaurus from "typesaurus";
import { db } from "./db";

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

export const playerId2Username = writable<Record<string, string>>({});
export function fetchUsernames(playerIds: string[]) {
  playerIds.forEach(async (id) => {
    const player = (await typesaurus.get(db.players, id))?.data;
    playerId2Username.update((store) => {
      if (player) {
        store[id] = player.username;
      } else {
        delete store[id];
      }
      return store;
    });
  });
}

derived([username, playerId], (x) => x).subscribe(([username, playerId]) => {
  if (!username || !playerId) {
    return;
  }
  typesaurus.upset(db.players, playerId, { username });
});
