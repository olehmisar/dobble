import { writable } from "svelte/store";
import { generate } from "./dobble-algo";
import { sha256 } from "hash.js";
import _ from "lodash";

const _s = writable<{
  players: Record<string, Player>;
  remainingCards: Card[];
}>({
  players: {},
  remainingCards: [],
});

type Pic = number;

export type Card = {
  id: string;
  pics: Pic[];
};

type Player = {
  name: string;
  cards: Card[];
  lastMoveWasWrong: boolean;
};

type Move = {
  player: string;
  selectedPic: Pic;
};

export const gameState = {
  subscribe: _s.subscribe,
  startGame(playerNames: string[]) {
    const cards = generate(4).map((pics) => ({
      id: sha256().update(pics.join()).digest("hex"),
      pics,
    }));
    const players: Record<string, Player> = {};
    for (let i = 0; i < playerNames.length; i++) {
      players[playerNames[i]] = {
        name: playerNames[i],
        cards: [cards.pop()!],
        lastMoveWasWrong: false,
      };
    }
    _s.set({
      players,
      remainingCards: cards,
    });
  },
  doMove(move: Move) {
    _s.update((s) => {
      if (s.players[move.player].lastMoveWasWrong) {
        return s;
      }
      const topDeckCard = _.last(s.remainingCards);
      if (!topDeckCard || !cardContainsPic(topDeckCard, move.selectedPic)) {
        return s;
      }
      const topPlayerCard = _.last(s.players[move.player].cards)!;
      if (!cardContainsPic(topPlayerCard, move.selectedPic)) {
        s.players[move.player].lastMoveWasWrong = true;
        return s;
      }
      s.players[move.player].cards.push(s.remainingCards.pop()!);
      Object.values(s.players).forEach((player) => {
        player.lastMoveWasWrong = false;
      });
      return s;
    });
  },
};

function cardContainsPic(card: Card, pic: Pic) {
  return card.pics.some((p) => p === pic);
}
