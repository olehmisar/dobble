<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Pic from "./Pic.svelte";
  import { templates } from "../shared/templates";
  export let pics: number[];
  export let clickable = false;
  export let disabled = false;

  $: template = templates[0];
  const dispatch = createEventDispatcher<{ move: number }>();
</script>

<div class="card" class:disabled>
  {#each pics as pic, i}
    <Pic
      x={`${template[i].x}%`}
      y={`${template[i].y}%`}
      scale={template[i].scale}
      {pic}
      {clickable}
      {disabled}
      on:click={() => dispatch("move", pic)}
    />
  {/each}
</div>

<style>
  .card {
    width: 100%;
    height: 100%;
    font-size: calc(var(--size) * 0.3);
    border: 1px solid black;
    border-radius: 5%;
    position: relative;
    background: white;
    user-select: none;
  }

  .card.disabled {
    background: gray;
  }
</style>
