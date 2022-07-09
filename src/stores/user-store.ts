import firebase from "firebase";
import _ from "lodash";
import { derived, readable } from "svelte/store";
import { persistentWritable } from "../shared/local-storage-store";
import * as typesaurus from "typesaurus";
import { db } from "../db";

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

export const myPlayerId = readable<string | undefined>(undefined, (set) => {
  firebase
    .auth()
    .onAuthStateChanged((user) => set(user ? user.uid : undefined));
});

export function fetchUsernames(playerIds: string[]) {
  return readable<Record<string, string>>(
    _(playerIds)
      .keyBy((id) => id)
      .value(),
    (set) => {
      typesaurus.onGetMany(db.players, playerIds, (players) => {
        set(
          _(players)
            .keyBy((doc) => doc.ref.id)
            .mapValues((p) => p.data.username)
            .value()
        );
      });
    }
  );
}

derived([username, myPlayerId], (x) => x).subscribe(
  ([username, myPlayerId]) => {
    if (!username || !myPlayerId) {
      return;
    }
    typesaurus.upset(db.players, myPlayerId, { username });
  }
);
