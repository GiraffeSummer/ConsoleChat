<script lang="ts">
  import Center from './components/Center.svelte';
  import Message from './components/Message.svelte';
  import Chat from './components/Chat.svelte';
  import { messages, Connect, data } from './lib/client.ts';

  let isLoggedin = false;
  let username = '';

  function Login() {
    Connect('http://localhost:80', {
      name: username,
      color: '#0000ff',
      version: 1,
    });
    isLoggedin = true;
  }
</script>

<main>
  {#if isLoggedin}
    <Center>
      <span slot="left">
        {#if $data.channels}
          {#each $data.channels as channel}
            <tr class="clickable">
              {channel}
            </tr>
          {/each}
        {/if}
      </span>
      <span>
        {#each $messages as message}
          <Message {message} />
        {/each}

        <Chat></Chat>
      </span>
    </Center>
  {:else}
    <Center>
      <form on:submit|preventDefault={Login}>
        <fieldset>
          <input type="text" placeholder="username" bind:value={username} />
          <button type="submit" class="btn btn-default">Log in</button>
        </fieldset>
      </form>
    </Center>
  {/if}
</main>

<style>
  .clickable {
    cursor: pointer;
  }
</style>
