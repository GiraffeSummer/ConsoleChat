<script lang="ts">
  import Center from './components/Center.svelte';
  import Message from './components/Message.svelte';
  import { messages, Connect } from './lib/client.ts';

  Connect('http://localhost:80', {
    name: 'browser',
    color: '#ff0000',
    version: 1,
  });
</script>

<main>
  <Center>
    <span slot="left">hi</span>
    <span>
      {#each $messages as message}
        <Message {message} />
      {/each}
    </span>
  </Center>
</main>

<style>
</style>
