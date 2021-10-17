<script lang="ts">
  export let x: string;
  export let y: string;
  export let scale: string;
  export let rotation: string;
  export let pic: number;
  export let disabled: boolean;
  export let clickable: boolean;
</script>

<div
  class="pic"
  class:clickable
  class:disabled
  style={`--x: ${x}; --y: ${y}; --scale: ${scale}; --rotation: ${rotation}`}
  on:click
>
  <div class="pic-inner">
    {pic}
  </div>
</div>

<style>
  .pic {
    position: absolute;
    left: var(--x);
    top: var(--y);
    transform: translate(-50%, -50%) rotate(var(--rotation));
    transition: all 0.1s ease;
  }

  .pic.clickable:not(.disabled) {
    cursor: pointer;
  }

  .pic-inner {
    transform: scale(var(--scale));
    transition: all 0.1s ease;
  }

  .pic.clickable:not(.disabled):hover .pic-inner {
    transform: scale(calc(var(--scale) * 1.1));
  }
</style>
