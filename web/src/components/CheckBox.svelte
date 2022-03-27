<script>
  export let name = 'CheckBox'
  export let checked = false
</script>

<label style="margin-right: 8px; cursor: pointer">
  <input
    type="checkbox"
    bind:checked={checked}
  >
  {name}
</label>

<style>

</style>