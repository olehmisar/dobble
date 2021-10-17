<script lang="ts">
  import Game from "./Game.svelte";
  import { playerId, username } from "./user-store";
  import UsernameForm from "./UsernameForm.svelte";
</script>

{$playerId} - {$username}

{#if !$username}
  <UsernameForm />
{:else}
  <Game gameId="123" />
{/if}
