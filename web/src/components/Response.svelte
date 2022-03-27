<script>
  export let response = {}
</script>

{#if response.message}
  <div style="padding-top: 8px">
    <h4>response</h4>
    {#if response.message == 'please configure'}
      <a style="padding-left: 14px; color: red" href="#/config">{response.message}</a>
    {:else}
      <span style="padding-left: 14px; {response.success === false ? 'color: red' : ''}">{response.message}</span>
    {/if}
  </div>
{/if}