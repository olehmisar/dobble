import _ from "lodash";
import { get, readable } from "svelte/store";
import * as typesaurus from "typesaurus";
import { db } from "../db";
import { generate } from "../shared/dobble-algo";
import { iife, sha256 } from "../shared/utils";

type GameStateWaiting = {
  tag: "waiting";
  players: Record<string, boolean>;
};
type GameStateInProgress = {
  tag: "inProgress";
  players: Record<string, PlayerData>;
  remainingCards: Card[];
};
type GameStateFinished = {
  tag: "finished";
  winnerId: string;
  players: Record<string, PlayerData>;
  remainingCards: Card[];
};
export type GameState =
  | GameStateWaiting
  | GameStateInProgress
  | GameStateFinished;

function makeInitialState(playerIds: string[] = []): GameState {
  return {
    tag: "waiting",
    players: _(playerIds)
      .keyBy((id) => id)
      .mapValues(_.stubTrue)
      .value(),
  };
}

type Pic = number;

export type Card = {
  id: string;
  pics: Pic[];
};

type PlayerData = {
  playerId: string;
  cards: Card[];
  lastMoveWasWrong: boolean;
};

type Move = {
  playerId: string;
  selectedPic: Pic;
};

export function getGameState(gameId: string) {
  typesaurus.get(db.games, gameId).then((doc) => {
    if (doc) {
      return;
    }
    typesaurus.set(db.games, gameId, makeInitialState());
  });

  const _s = readable(makeInitialState(), (set) => {
    typesaurus.onGet(db.games, gameId, (doc) => doc && set(doc.data));
  });
  return {
    subscribe: _s.subscribe,
    async waitForPlayers() {
      typesaurus.set(
        db.games,
        gameId,
        makeInitialState(Object.keys(get(_s).players))
      );
    },
    async startGame(playerIds: Record<string, boolean>) {
      const cards = _(generate(8))
        .shuffle()
        .map((pics) => ({
          id: sha256(pics.join("|")).toString(),
          pics,
        }))
        .value();
      const players = _(playerIds)
        .toPairs()
        .filter(([, joined]) => joined)
        .map(([playerId]) => ({
          playerId,
          cards: [cards.pop()!],
          lastMoveWasWrong: false,
        }))
        .keyBy(({ playerId }) => playerId)
        .value();
      if (_.size(players) < 2) {
        return;
      }
      await typesaurus.set(db.games, gameId, {
        tag: "inProgress",
        players,
        remainingCards: cards,
      });
    },
    async joinGame(playerId: string) {
      if (get(_s).tag !== "waiting") {
        return;
      }
      await typesaurus.update<GameStateWaiting>(db.games, gameId, [
        typesaurus.field(["players", playerId], true),
      ]);
    },
    async removePlayer(playerId: string) {
      if (get(_s).tag !== "waiting") {
        return;
      }
      await typesaurus.update<GameStateWaiting>(db.games, gameId, [
        typesaurus.field(["players", playerId], false),
      ]);
    },
    async doMove(move: Move) {
      const s = get(_s);
      if (s.tag !== "inProgress") {
        return;
      }
      const player = s.players[move.playerId];
      if (!player || player.lastMoveWasWrong) {
        return;
      }
      const topDeckCard = _.last(s.remainingCards);
      if (!topDeckCard || !cardContainsPic(topDeckCard, move.selectedPic)) {
        return s;
      }
      await typesaurus.update(
        db.games,
        gameId,
        iife<GameState>(() => {
          const topPlayerCard = _.last(player.cards)!;
          if (!cardContainsPic(topPlayerCard, move.selectedPic)) {
            s.players[move.playerId]!.lastMoveWasWrong = true;
            if (
              Object.values(s.players)
                .map((player) => player.lastMoveWasWrong)
                .every((wrong) => wrong)
            ) {
              Object.values(s.players).forEach((player) => {
                player.lastMoveWasWrong = false;
              });
            }
            return s;
          }
          s.players[move.playerId]!.cards.push(s.remainingCards.pop()!);
          Object.values(s.players).forEach((player) => {
            player.lastMoveWasWrong = false;
          });
          if (s.remainingCards.length === 0) {
            const winnerId = _(s.players)
              .values()
              .orderBy((player) => player.cards.length, "desc")
              .first()!.playerId;
            return {
              tag: "finished",
              winnerId,
              players: s.players,
              remainingCards: s.remainingCards,
            };
          }
          return s;
        })
      );
    },
  };
}

function cardContainsPic(card: Card, pic: Pic) {
  return card.pics.some((p) => p === pic);
}
