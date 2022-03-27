<script>
  import request from '../lib/request'
  import Response from '../components/Response.svelte'

  let response = {}
  async function update(i) {
    response = await request(`/api/vhost/${sites[i].name}`, 'PUT', {
      enabled: !sites[i].enabled
    })

    if (response.success) {
      fetchData()
    }
  }

  let sites = []
  async function fetchData() {
    const res = await request('/api/vhost')
    if (!res.success) {
      response = res
      return
    }

    sites = res.data
  }

  fetchData()
</script>

<table>
  <tr>
    <th>site</th>
    <th>status</th>
    <th>action</th>
  </tr>
  {#each sites as site, i (i)}
    <tr>
      <td>{site.name}</td>
      <td>
        {#if site.enabled === true}
          <span style="background-color: #7be47b;">enabled</span>
        {:else if site.enabled === false}
          <span style="background-color: #ff7373;">disabled</span>
        {/if}
      </td>
      <td>
        <button on:click={() => update(i)}>{site.enabled === true ? 'disable' : 'enable'}</button>
      </td>
    </tr>
  {/each}
</table>

<Response {response}/>

<style>
  table {
    border-collapse: collapse;
  }
  
  td {
    border: 1px solid black;
    padding: 6px;
  }

  th {
    border: 1px solid black;
  }

  button {
    padding: 2px 4px;
    margin: 0 2px 0 2px;
  }
</style>