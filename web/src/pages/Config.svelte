<script>
	import Input from '../components/Input.svelte'
	import Response from '../components/Response.svelte'
	import request from '../lib/request'

	let nginxSitesAvailablePath = ''
	let nginxSitesEnabledPath = ''
	let nginxPublicHTMLBasePath = ''
	let nginxSSLPath = ''
	let phpVersion = ''

	let response = {}
	async function update() {
		response = await request('/api/config', 'PUT', {
			nginxSitesAvailablePath,
			nginxSitesEnabledPath,
			nginxPublicHTMLBasePath,
			nginxSSLPath,
			phpVersion
		})

		if (response.success) {
			fetchData()
		}
  }

	async function fetchData() {
		const res = await request('/api/config')
		if (!res.success) {
			response = res
		}
		nginxSitesAvailablePath = res.data.nginxSitesAvailablePath || ''
		nginxSitesEnabledPath = res.data.nginxSitesEnabledPath || ''
		nginxPublicHTMLBasePath = res.data.nginxPublicHTMLBasePath || ''
		nginxSSLPath = res.data.nginxSSLPath || ''
		phpVersion = res.data.phpVersion || ''
	}

	fetchData()
</script>

<div>
	<Input
		name="NGINX Sites Available Path"
		width="100"
		placeholder="/etc/nginx/sites-available"
		bind:value={nginxSitesAvailablePath}
	/>
	<Input
		name="NGINX Sites Enabled Path"
		width="100"
		placeholder="/etc/nginx/sites-enabled"
		bind:value={nginxSitesEnabledPath}
	/>
	<Input
		name="NGINX Public HTML Base Path"
		width="100"
		placeholder="/var/www"
		bind:value={nginxPublicHTMLBasePath}
	/>
	<Input
		name="NGINX SSL Path"
		width="100"
		placeholder="/etc/ssl/nginx"
		bind:value={nginxSSLPath}
	/>
	<Input
		name="PHP Version"
		width="100"
		placeholder="7.4"
		bind:value={phpVersion}
	/>

	<button on:click={update}>Save</button>

	<Response {response}/>
</div>

<style>
	
</style>