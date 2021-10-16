<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Pic from "./Pic.svelte";
  import { templates } from "./templates";
  export let pics: number[];
  export let clickable = false;
  export let disabled = false;

  $: template = templates[0];
  const dispatch = createEventDispatcher<{ move: number }>();
</script>

<div class="card">
  {#each pics as pic, i}
    <Pic
      x={`${template[i].x}%`}
      y={`${template[i].y}%`}
      {pic}
      {clickable}
      {disabled}
      on:click={() => dispatch("move", pic)}
    />
  {/each}
</div>

<style>
  .card {
    width: 160px;
    height: 240px;
    font-size: 3rem;
    border: 1px solid black;
    position: relative;
    background: white;
    user-select: none;
  }
</style>
