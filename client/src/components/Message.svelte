<script lang="ts">
  export let message;
</script>

<div>
    <span style="color: {message.user.color};">{message.user.name}: </span>{message.message}
</div>

<style>
 
</style>
