<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { username } from "../stores/user-store";
  let usernameInput = $username ?? "";
  const dispatch = createEventDispatcher<{ change: string }>();
  function submit() {
    $username = usernameInput.trim();
    dispatch("change", $username);
  }
</script>

<form on:submit|preventDefault={submit}>
  <input placeholder="Username" bind:value={usernameInput} />
  <button type="submit" disabled={!usernameInput.trim()}>Play</button>
</form>
