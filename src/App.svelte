<script lang="ts">
  import Game from "./Game.svelte";
  import { username } from "./user-store";
  import UsernameForm from "./UsernameForm.svelte";
</script>

{#if !$username}
  <UsernameForm />
{:else}
  <Game player={$username} />
{/if}
