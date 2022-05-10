<script lang="ts">
  import { Send } from '../lib/client.ts';
  let message = '';
  function send() {
    message = message.trim();
    Send(message);
    message = '';
  }
</script>

<div class="content">
  <form on:submit|preventDefault={send}>
    <fieldset>
      <input type="text" placeholder="message" bind:value={message} />
      <input type="submit" class="btn btn-primary" value="Send" />
    </fieldset>
  </form>
</div>

<style>
  div.content {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    float: bottom;
  }
</style>
