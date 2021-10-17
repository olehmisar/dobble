import firebase from "firebase/app";
import "firebase/firestore";
import * as typesaurus from "typesaurus";
import { firebaseConfig } from "./env";
import type { GameState } from "./stores/state";

firebase.initializeApp(firebaseConfig);

type Player = {
  username: string;
};

export const db = {
  players: typesaurus.collection<Player>("players"),
  games: typesaurus.collection<GameState>("games"),
};
