<script>
  export let name = 'TextArea'
  export let cols = 80
  export let rows = 20
  export let value = ''
</script>

<h4>{name}</h4>
<textarea
  {cols}
  {rows}
  bind:value={value}
/>