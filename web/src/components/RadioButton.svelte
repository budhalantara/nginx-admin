<script>
  export let name = 'RadioButton'
  export let group = ''
  export let value = ''
</script>

<label style="margin-right: 8px; cursor: pointer">
  <input
    type="radio"
    value={value}
    bind:group={group}
  >
  {name}
</label>

<style>

</style>