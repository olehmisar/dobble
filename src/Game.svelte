<script lang="ts">
  import { moveAnimation } from "./animation";
  import Card from "./Card.svelte";
  import { getGameState } from "./state";
  import { playerId } from "./user-store";

  export let gameId: string;

  const [moveAnimationSend, moveAnimationReceive] = [
    moveAnimation.send,
    moveAnimation.receive,
  ];

  $: gameState = $playerId && getGameState(gameId, $playerId);

  let coords: Record<string, { x: number; y: number }> = {};
  $: {
    if (gameState && $gameState.tag === "inProgress") {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const r = Math.min(w, h);
      const players = Object.values($gameState.players);
      players.forEach((player, i) => {
        const angle = (i * Math.PI * 2) / players.length;
        const x = (w + Math.cos(angle) * r) / 2;
        const y = (h + Math.sin(angle) * r) / 2;
        coords[player.playerId] = { x, y };
      });
    }
  }
</script>

{#if !gameState}
  Loading...
{:else if $gameState.tag === "waiting"}
  <p>Waiting...</p>
  {#each Object.entries($gameState.playerIds)
    .filter(([, joined]) => joined)
    .map(([id]) => id) as id}
    <p>{id}</p>
  {/each}
  <button
    on:click={() => {
      if (!gameState || $gameState.tag !== "waiting" || !$playerId) {
        return;
      }
      gameState.joinGame($playerId);
    }}
  >
    Join
  </button>
  <button
    on:click={() => {
      if (!gameState || $gameState.tag !== "waiting") {
        return;
      }
      gameState.startGame($gameState.playerIds);
    }}>Start game</button
  >
{:else}
  <div class="relative">
    {#if $gameState.tag === "finished"}
      <p>Winner: {$gameState.winnerId}</p>
    {/if}
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
            if (!gameState || !$playerId) {
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

  <div class="relative">
    {#each Object.values($gameState.players) as player}
      <div
        style={`
        position: absolute;
        left: ${coords[player.playerId]?.x}px;
        top: ${coords[player.playerId]?.y}px}
      `}
      >
        {player.playerId}
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
    {/each}
  </div>
{/if}

<style>
  .card-wrapper {
    position: absolute;
  }

  .relative {
    position: relative;
  }
</style>
