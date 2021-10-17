<script lang="ts">
  import Game from "./components/Game.svelte";
  import { playerId, username } from "./stores/user-store";
  import UsernameForm from "./components/UsernameForm.svelte";
  import { Router, Route, links, navigate } from "svelte-routing";
  import * as typesaurus from "typesaurus";
  import { db } from "./db";

  let newGameId = "";
</script>

{$playerId} - {$username}

{#if !$username}
  <UsernameForm />
{:else}
  <div use:links>
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
  </div>
{/if}
