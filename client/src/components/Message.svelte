<script lang="ts">
  export let message;
</script>

<div class="terminal-card">
  <header>
    <span style="color: {message.user.color};">> {message.user.name} _</span>
  </header>
  <div>
    {message.message}
  </div>
</div>

<style>
</style>
