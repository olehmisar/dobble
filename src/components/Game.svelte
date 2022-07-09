<script lang="ts">
  import { moveAnimation } from "../shared/animation";
  import Card from "./Card.svelte";
  import { getGameState } from "../stores/state";
  import { fetchUsernames } from "../stores/user-store";
  import _ from "lodash";
  import { onDestroy } from "svelte";

  export let gameId: string;
  export let myPlayerId: string;

  const [moveAnimationSend, moveAnimationReceive] = [
    moveAnimation.send,
    moveAnimation.receive,
  ];

  $: gameState = getGameState(gameId);
  let playerIds: string[] = [];
  $: {
    if ($gameState) {
      const ids = Object.keys($gameState.players).sort();
      if (!_.isEqual(ids, playerIds)) {
        playerIds = ids;
      }
    }
  }
  $: playerId2Username = fetchUsernames(playerIds);
  $: myCards =
    $gameState && $gameState.tag !== "waiting"
      ? $gameState.players[myPlayerId]?.cards ?? []
      : [];
  $: players =
    $gameState && $gameState.tag !== "waiting"
      ? _($gameState.players)
          .values()
          .orderBy((p) => p.playerId)
          .value()
      : [];

  function joinGame() {
    gameState.joinGame(myPlayerId);
  }

  let initiallyJoined = false;
  $: {
    if (!initiallyJoined && $gameState?.tag === "waiting") {
      initiallyJoined = true;
      joinGame();
    }
  }

  function leaveGame() {
    gameState.removePlayer(myPlayerId);
  }
  onDestroy(leaveGame);
  window.addEventListener("beforeunload", leaveGame);
</script>

{#if !$gameState}
  Loading game...
{:else if $gameState.tag === "waiting"}
  <p>Waiting for more players...</p>
  <p>
    Send this link to your friends so they can join the game: <a
      href={window.location.href}>{window.location.href}</a
    >
  </p>
  <h4>Players joined:</h4>
  {#each Object.entries($gameState.players)
    .filter(([, joined]) => joined)
    .map(([playerId]) => playerId) as playerId}
    <p>
      {$playerId2Username[playerId]}
    </p>
  {/each}

  {#if !$gameState.players[myPlayerId]}
    <button on:click={joinGame}>Join game</button>
  {:else}
    <button on:click={leaveGame}>Leave game</button>
  {/if}
  <button
    disabled={$gameState.tag === "waiting" &&
      _($gameState.players).values().compact().size() < 2}
    title="2 players minimum"
    on:click={() => {
      if ($gameState?.tag !== "waiting") {
        return;
      }
      gameState.startGame($gameState.players);
    }}>Start game</button
  >
{:else}
  {#if $gameState.tag === "finished"}
    <p>
      Winner: {$playerId2Username[$gameState.winnerId]}
    </p>
    <p>Results:</p>
    <ul>
      {#each players as player (player.playerId)}
        <li>
          {$playerId2Username[player.playerId]} - {player.cards.length} cards
        </li>
      {/each}
    </ul>
  {/if}
  <p>
    <button
      on:click={() => {
        const confirmed =
          $gameState?.tag === "finished" || confirm("Restart the game?");
        if (!confirmed) {
          return;
        }
        gameState.restartGame();
      }}>Restart</button
    >
  </p>
  <div class="game">
    <div style="display: flex; justify-content: space-around; gap: 1rem;">
      {#each players.filter((p) => p.playerId !== myPlayerId) as player (player.playerId)}
        <div class="center">
          {$playerId2Username[player.playerId]}
          <div class="deck" style="--size: 60px;">
            {#each player.cards as card}
              <div
                class="card-wrapper"
                in:moveAnimationReceive={{ key: card.id }}
                out:moveAnimationSend={{ key: card.id }}
              >
                <Card pics={card.pics} />
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <div class="center">
      <div class="deck" style="--size: 240px;">
        {#each $gameState.remainingCards as card (card.id)}
          <div
            class="card-wrapper"
            in:moveAnimationReceive={{ key: card.id }}
            out:moveAnimationSend={{ key: card.id }}
          >
            <Card
              pics={card.pics}
              clickable
              disabled={!!$gameState.players[myPlayerId]?.lastMoveWasWrong}
              on:move={(e) => {
                gameState.doMove({
                  playerId: myPlayerId,
                  selectedPic: e.detail,
                });
              }}
            />
          </div>
        {/each}
      </div>
      {$gameState.remainingCards.length} card{$gameState.remainingCards
        .length === 1
        ? ""
        : "s"}
    </div>

    <div class="center">
      <div class="deck" style="--size: 240px">
        {#each myCards as card}
          <div
            class="card-wrapper"
            in:moveAnimationReceive={{ key: card.id }}
            out:moveAnimationSend={{ key: card.id }}
          >
            <Card pics={card.pics} />
          </div>
        {/each}
      </div>
      My cards
    </div>
  </div>
{/if}

<style>
  .game {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
    background: #387d44;
    border: 20px solid #6f4f38;
    border-radius: 100px;
    padding: 1rem;
  }

  .deck {
    position: relative;
    width: var(--size);
    height: var(--size);
  }

  .card-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
