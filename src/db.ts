import firebase from "firebase/app";
import "firebase/firestore";
import * as typesaurus from "typesaurus";
import { env } from "./env";
import type { GameState } from "./stores/state";

firebase.initializeApp(env.VITE_FIREBASE_CONFIG);

type Player = {
  username: string;
};

export const db = {
  players: typesaurus.collection<Player>("players"),
  games: typesaurus.collection<GameState>("games"),
};
