<script lang="ts">
  export let x: string;
  export let y: string;
  export let scale: string;
  export let pic: number;
  export let disabled: boolean;
  export let clickable: boolean;
</script>

<div
  class="pic"
  class:clickable
  class:disabled
  style={`--x: ${x}; --y: ${y}; --scale: ${scale}`}
  on:click
>
  {pic}
</div>

<style>
  .pic {
    position: absolute;
    left: var(--x);
    top: var(--y);
    transform: scale(var(--scale));
    transition: all 0.1s ease;
  }

  .pic.clickable:not(.disabled) {
    cursor: pointer;
  }

  .pic.clickable:not(.disabled):hover {
    transform: scale(calc(var(--scale) * 1.1));
  }
</style>
