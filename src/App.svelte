<script lang="ts">
  import Game from "./components/Game.svelte";
  import { myPlayerId, username } from "./stores/user-store";
  import UsernameForm from "./components/UsernameForm.svelte";
  import { Router, Route, links, navigate } from "svelte-routing";
  import { sha256 } from "./shared/utils";

  let newGameId = sha256(Math.random()).toString(16).slice(0, 8);
  let showUsernameForm = false;
</script>

<div use:links>
  <header style="display: flex; gap: 1rem">
    <a href="/" style="font-size: 2rem;">Dobble</a>
    <div style="flex-grow: 1" />
    <div>
      {$username}
      <button
        on:click={() => {
          showUsernameForm = true;
        }}>Change username</button
      >
    </div>
  </header>

  {#if !$username || showUsernameForm}
    <UsernameForm
      on:change={() => {
        showUsernameForm = false;
      }}
    />
  {/if}

  {#if $username}
    {#if !$myPlayerId}
      Logging in...
    {:else}
      <Router>
        <Route path="/play/:gameId" let:params>
          <Game myPlayerId={$myPlayerId} gameId={params.gameId || ""} />
        </Route>
        <Route>
          <form
            on:submit|preventDefault={async () => {
              newGameId = newGameId.trim();
              navigate(`/play/${newGameId}`);
            }}
          >
            Room name:
            <input bind:value={newGameId} />
            <button>Create/Join Room</button>
          </form>
        </Route>
      </Router>
    {/if}
  {/if}
</div>
