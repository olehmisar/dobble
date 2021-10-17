<script lang="ts">
  import { moveAnimation } from "../shared/animation";
  import Card from "./Card.svelte";
  import { getGameState } from "../stores/state";
  import { fetchUsernames, playerId } from "../stores/user-store";
  import _ from "lodash";
  import { onDestroy } from "svelte";

  export let gameId: string;

  const [moveAnimationSend, moveAnimationReceive] = [
    moveAnimation.send,
    moveAnimation.receive,
  ];

  $: gameState = getGameState(gameId);
  $: playerId2Username = fetchUsernames(Object.keys($gameState.players));
  $: myCards =
    ($gameState.tag !== "waiting" &&
      $playerId &&
      $gameState.players[$playerId]?.cards) ||
    [];
  $: players =
    $gameState.tag !== "waiting"
      ? _($gameState.players)
          .values()
          .orderBy((p) => p.playerId)
          .value()
      : [];

  function leaveGame() {
    if (!$playerId) {
      return;
    }
    gameState.removePlayer($playerId);
  }
  onDestroy(leaveGame);
  window.addEventListener("beforeunload", leaveGame);
</script>

{#if $gameState.tag === "waiting"}
  <p>Waiting...</p>
  {#each Object.entries($gameState.players)
    .filter(([, joined]) => joined)
    .map(([playerId]) => playerId) as playerId}
    <p>
      {$playerId2Username[playerId]}
      <button
        title="Remove player"
        style="color: red"
        on:click={() => {
          gameState.removePlayer(playerId);
        }}>X</button
      >
    </p>
  {/each}
  <button
    on:click={() => {
      if ($gameState.tag !== "waiting" || !$playerId) {
        return;
      }
      gameState.joinGame($playerId);
    }}
  >
    Join
  </button>
  <button
    disabled={$gameState.tag === "waiting" &&
      _($gameState.players).values().compact().size() < 2}
    title="2 players minimum"
    on:click={() => {
      if ($gameState.tag !== "waiting") {
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
          $gameState.tag === "finished" || confirm("Restart the game?");
        if (!confirmed) {
          return;
        }
        gameState.waitForPlayers();
      }}>Restart</button
    >
  </p>
  <div class="game">
    <div style="display: flex; justify-content: space-around; gap: 1rem;">
      {#each players.filter((p) => p.playerId !== $playerId) as player (player.playerId)}
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
              disabled={!!(
                $playerId && $gameState.players[$playerId]?.lastMoveWasWrong
              )}
              on:move={(e) => {
                if (!$playerId) {
                  return;
                }
                gameState.doMove({
                  playerId: $playerId,
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
