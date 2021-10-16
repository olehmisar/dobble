<script lang="ts">
  import { username } from "./user-store";
  let usernameInput = "";
  function submit() {
    $username = usernameInput.trim();
  }
</script>

<form on:submit|preventDefault={submit}>
  <input placeholder="Username" bind:value={usernameInput} />
  <button type="submit" disabled={!usernameInput.trim()}>Play</button>
</form>
