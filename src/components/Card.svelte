<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Pic from "./Pic.svelte";
  import { templates } from "../shared/templates";
  import { sha256 } from "../shared/utils";
  import type { PicData } from "../stores/state";

  export let pics: PicData[];
  export let clickable = false;
  export let disabled = false;

  $: template = templates[sha256(pics.join("|")) % templates.length]!;
  function getTemplateItem(i: number) {
    // `!` does not work in markup
    return template[i]!;
  }

  const dispatch = createEventDispatcher<{ move: PicData }>();
</script>

<div class="card" class:disabled>
  {#each pics as pic, i}
    <Pic
      {...getTemplateItem(i)}
      {pic}
      {clickable}
      {disabled}
      on:mousedown={() => dispatch("move", pic)}
    />
  {/each}
</div>

<style>
  .card {
    width: 100%;
    height: 100%;
    font-size: calc(var(--size) * 0.2);
    border: 3px solid black;
    border-radius: 50%;
    position: relative;
    background: white;
    user-select: none;
  }

  .card.disabled {
    background: gray;
  }
</style>
