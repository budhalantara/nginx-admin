<script>
  import { location } from 'svelte-spa-router'
  import request from '../lib/request'
  import Input from '../components/Input.svelte'
  import TextArea from '../components/TextArea.svelte'
  import Response from '../components/Response.svelte'

  export let params = {}

  let SSLs = []
  let sslDetail = {}
  let isCreate = false

  let name = ''
  let certificate = ''
  let privateKey = ''

  let response = {}
  async function create() {
    response = await request('/api/ssl', 'POST', {
      name,
      certificate,
      privateKey
    })
  }

  async function fetchData() {
    const req = await request('/api/ssl')
    SSLs = req.data
  }

  async function getDetail() {
    const req = await request('/api/ssl/' + params?.name)
    sslDetail = req.data
  }

  if ($location === '/ssl') {
    fetchData()
  } else if (params?.name) {
    getDetail()
  }
</script>

{#if $location === '/ssl' && !isCreate}
  <ul>
    {#each SSLs as SSL}
      <li>
        <a href="#{$location}/{SSL}">{SSL}</a>
      </li>
    {/each}
  </ul>
  <button on:click={() => isCreate = true}>new</button>
{:else if isCreate}
  <Input
    name="name"
    placeholder="rivalshop.id"
    bind:value={name}
  />

  <TextArea
    name="certificate"
    bind:value={certificate}
  />

  <TextArea
    name="private key"
    bind:value={privateKey}
  />
  <br>
  <button on:click={create}>Create</button>
  <Response {response}/>
{:else if params?.name}
  <h3 style="margin-bottom: 12px">
    ssl: {params.name}
  </h3>

  <TextArea
    name="certificate"
    value={sslDetail.cert?.content}
  />

  <TextArea
    name="private key"
    value={sslDetail.key?.content}
  />
{/if}
