import firebase from "firebase/app";
import "firebase/firestore";
import * as typesaurus from "typesaurus";
import type { GameState } from "./state";

firebase.initializeApp({
  apiKey: "AIzaSyAEJv_M-8O3GK1dGFkxjHKm-NV2iDyaxfU",
  authDomain: "dobble-36cb5.firebaseapp.com",
  projectId: "dobble-36cb5",
  storageBucket: "dobble-36cb5.appspot.com",
  messagingSenderId: "914218216804",
  appId: "1:914218216804:web:e3d1a4f9a8daf7498a9e71",
});

type Player = {
  username: string;
};

export const db = {
  players: typesaurus.collection<Player>("players"),
  games: typesaurus.collection<GameState>("games"),
};
