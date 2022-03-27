<script>
  export let response = {}
</script>

{#if response.message}
  <div style="padding-top: 8px">
    <h4>response</h4>
    <span style="padding-left: 14px; {response.success === false ? 'color: red' : ''}">{response.message}</span>
  </div>
{/if}