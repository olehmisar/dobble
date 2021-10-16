<script lang="ts">
  import { moveAnimation } from "./animation";
  import Card from "./Card.svelte";
  import { gameState } from "./state";

  export let player: string;

  const [moveAnimationSend, moveAnimationReceive] = [
    moveAnimation.send,
    moveAnimation.receive,
  ];

  gameState.startGame(["oleh", "ivan"]);
  let coords: Record<string, { x: number; y: number }> = {};
  $: {
    const players = Object.values($gameState.players);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const r = Math.min(w, h);
    for (let i = 0; i < players.length; i++) {
      const angle = (i * Math.PI * 2) / players.length;
      const x = (w + Math.cos(angle) * r) / 2;
      const y = (h + Math.sin(angle) * r) / 2;
      coords[players[i].name] = { x, y };
    }
  }
</script>

<div class="relative">
  {#each $gameState.remainingCards as card}
    <div
      class="card-wrapper"
      in:moveAnimationReceive={{ key: card.id }}
      out:moveAnimationSend={{ key: card.id }}
    >
      <Card
        pics={card.pics}
        clickable
        disabled={$gameState.players[player].lastMoveWasWrong}
        on:move={(e) => {
          gameState.doMove({ player, selectedPic: e.detail });
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
        left: ${coords[player.name].x}px;
        top: ${coords[player.name].y}px}
      `}
    >
      {player.name}
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

<style>
  .card-wrapper {
    position: absolute;
  }

  .relative {
    position: relative;
  }
</style>
