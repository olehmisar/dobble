<script lang="ts">
  import Game from "./components/Game.svelte";
  import { myPlayerId, username } from "./stores/user-store";
  import UsernameForm from "./components/UsernameForm.svelte";
  import { Router, Route, links, navigate } from "svelte-routing";
  import { sha256 } from "./shared/utils";

  let showUsernameForm = false;

  let joinGameIdOrLink = "";
  function createOrJoinGame(gameId: string) {
    navigate(`/play/${gameId}`);
  }
</script>

<div use:links>
  <header style="display: flex; gap: 1rem">
    <a href="/" style="font-size: 2rem;">Dobble</a>
    <div style="flex-grow: 1" />
    <div>
      {$username}
      <button
        on:click={() => {
          showUsernameForm = !showUsernameForm;
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
          <center>
            <form
              on:submit|preventDefault={() => {
                const newGameId = sha256(Math.random())
                  .toString(16)
                  .slice(0, 8);
                createOrJoinGame(newGameId);
              }}
            >
              <h3>Create a game</h3>
              <button>Create</button>
            </form>
            <form
              on:submit|preventDefault={async () => {
                let joinGameId = joinGameIdOrLink.trim();
                {
                  // if it is a link, get the ID
                  const startPattern = "/play/";
                  const startIndex = joinGameId.indexOf(startPattern);
                  if (startIndex !== -1) {
                    joinGameId = joinGameId.slice(
                      startIndex + startPattern.length
                    );
                    const endPattern = "/";
                    const endIndex = joinGameId.indexOf(endPattern);
                    if (endIndex !== -1) {
                      joinGameId = joinGameId.slice(0, endIndex);
                    }
                  }
                }
                createOrJoinGame(joinGameId);
              }}
            >
              <hr />
              OR
              <hr />
              <div>
                <h3>Join already existing game</h3>
                <div>
                  Room ID or room link:
                  <input bind:value={joinGameIdOrLink} />
                </div>
                <button>Join</button>
              </div>
            </form>
          </center>
        </Route>
      </Router>
    {/if}
  {/if}
</div>
