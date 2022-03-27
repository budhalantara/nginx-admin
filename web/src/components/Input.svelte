<script>
  export let name = 'Input'
  export let value = ''
  export let type = 'text'
  export let placeholder = ''
  export let width = 30
  export let readonly = false

  function onInput(e) {
    value = e.target.value
  }
</script>

<div>
  <label>
    {name}
    <input
      style='width: {width}%'
      {type}
      {value}
      {placeholder}
      {readonly}
      on:input={onInput}
    >
  </label>
</div>

<style>

</style>