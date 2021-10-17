<script lang="ts">
  import { moveAnimation } from "./animation";
  import Card from "./Card.svelte";
  import { getGameState } from "./state";
  import { fetchUsernames, playerId, playerId2Username } from "./user-store";
  import _ from "lodash";

  export let gameId: string;

  const [moveAnimationSend, moveAnimationReceive] = [
    moveAnimation.send,
    moveAnimation.receive,
  ];

  $: gameState = getGameState(gameId);
  $: {
    fetchUsernames(Object.keys($gameState.players));
  }
  $: myCards =
    ($gameState.tag !== "waiting" &&
      $playerId &&
      $gameState.players[$playerId]?.cards) ||
    [];
</script>

{#if $gameState.tag === "waiting"}
  <p>Waiting...</p>
  {#each Object.entries($gameState.players)
    .filter(([, joined]) => joined)
    .map(([playerId]) => playerId) as playerId}
    <p>{$playerId2Username[playerId]}</p>
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
      <button
        on:click={() => {
          if ($gameState.tag !== "finished") {
            return;
          }
          gameState.waitForPlayers();
        }}>Again</button
      >
    </p>
  {/if}
  <div class="game">
    <div style="display: flex; justify-content: space-around; gap: 1rem;">
      {#each _($gameState.players)
        .values()
        .filter((p) => p.playerId !== $playerId)
        .orderBy((p) => p.playerId)
        .value() as player}
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

    <div class="deck" style="--size: 120px;">
      {#each $gameState.remainingCards as card}
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

    <div class="center">
      <div class="deck" style="--size: 120px">
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
    height: calc(var(--size) * 1.5);
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
