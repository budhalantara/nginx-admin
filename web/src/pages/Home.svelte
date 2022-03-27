<script>
	import Input from '../components/Input.svelte'
	import CheckBox from '../components/CheckBox.svelte'
	import RadioButton from '../components/RadioButton.svelte'
	import Response from '../components/Response.svelte'
	import request from '../lib/request'

	const types = [
		{ name: 'Regular Files', value: 'regular' },
		{ name: 'Single Page Application', value: 'spa' },
		{ name: 'Proxied', value: 'proxied' },
	]

	let domain = ''
	let ssl = ''
	let rootType = 'regular'
	let proxyUrl = 'http://127.0.0.1:3000'
	let isUsingPHP = false
	let overwrite = false
	// let location = '/'
	
	let publicHTMLBasePath = ''
	let publicHTMLPath
	$: {
		publicHTMLPath = !domain ? '' : (publicHTMLBasePath + '/' + domain)
	}
	
	let response = {}
  async function create() {
		response = await request('/api/vhost', 'POST', {
			domain,
			ssl,
			rootType,
			proxyUrl,
			isUsingPHP,
			overwrite
		})
  }

	let certs = []
	async function fetchData() {
		const [ssl, config] = await Promise.all([
			request('/api/ssl'),
			request('/api/config')
		])
		certs = ssl.data
		publicHTMLBasePath = config.data.nginxPublicHTMLBasePath
	}

	fetchData()
</script>

<div>
	<Input
		name="domain"
		placeholder="sub.rivalshop.id"
		bind:value={domain}
	/>

	<label>
		SSL
		<select
			bind:value={ssl}
		>
			<option value="">-</option>
			{#each certs as cert}
				<option value={cert}>{cert}</option>
			{/each}
		</select>
	</label>

	<div style="margin-top: 10px;">
		{#each types as type}
			<RadioButton
				name={type.name}
				value={type.value}
				bind:group={rootType}
			/>
		{/each}
		{#if rootType == 'spa' || rootType == 'regular'}
			<p>public_html: {publicHTMLPath}</p>
			<!-- <Input
				name="public_html"
				readonly={true}
				bind:value={publicHTMLPath}
			/> -->
			<!-- <Input
				name="location"
				readonly={true}
				bind:value={location}
			/> -->
		{:else if rootType == 'proxied'}
			<Input
				name="proxy url"
				bind:value={proxyUrl}
			/>
		{/if}
	</div>

	{#if rootType !== 'proxied'}
		<div style="margin-top: 10px;">
			<CheckBox
				name="PHP Support"
				bind:checked={isUsingPHP}
			/>
		</div>
	{/if}

	<div style="margin-top: 10px;">
		<CheckBox
			name="Overwrite if exist"
			bind:checked={overwrite}
		/>
	</div>

  <button
		style="margin-top: 10px;"
		on:click={create}
	>
		Create
	</button>

	<Response {response}/>
</div>

<style>
	
</style>