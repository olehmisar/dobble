<script lang="ts">
  import Game from "./components/Game.svelte";
  import { username } from "./stores/user-store";
  import UsernameForm from "./components/UsernameForm.svelte";
  import { Router, Route, links, navigate } from "svelte-routing";
  import * as typesaurus from "typesaurus";
  import { db } from "./db";

  let newGameId = "";
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
  {:else}
    <Router>
      <Route path="/play/:gameId" let:params>
        <Game gameId={params.gameId || ""} />
      </Route>
      <Route>
        <form
          on:submit|preventDefault={async () => {
            newGameId = newGameId.trim();
            if ((await typesaurus.get(db.games, newGameId))?.data) {
              alert("Room exists");
            }
            navigate(`/play/${newGameId}`);
          }}
        >
          <input bind:value={newGameId} placeholder="Room Name" />
          <button>New game</button>
        </form>
      </Route>
    </Router>
  {/if}
</div>
