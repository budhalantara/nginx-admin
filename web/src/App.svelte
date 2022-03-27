<script>
	// import { Router, Route, Link } from "svelte-routing";
	import Router, { location } from 'svelte-spa-router'
  import Home from './pages/Home.svelte'
  import Config from './pages/Config.svelte'
  import SSL from './pages/SSL.svelte'
  import Sites from './pages/Sites.svelte'

	const routes = [
		{
			name: 'home',
			path: '/',
			component: Home
		},
		{
			name: 'sites',
			path: '/sites',
			component: Sites
		},
		{
			name: 'ssl',
			path: '/ssl',
			detail: '/:name',
			component: SSL
		},
		{
			name: 'config',
			path: '/config',
			component: Config
		}
	]

	const renderedRoutes = {}
	routes.forEach(x => {
		renderedRoutes[x.path] = x.component
		if (x.detail) {
			renderedRoutes[x.path + x.detail] = x.component
		}
	})
</script>

<div style="padding-bottom: 6px;">
	<!-- {#each routes.filter(x => x.isMenu) as route, i} -->
	{#each routes as route, i}
		<a
			href="/#{route.path}"
			style="margin-right: 4px; margin-left: 4px;"
		>{route.name}</a>
		{#if i < routes.length - 1}
			|
		{/if}
	{/each}
</div>

<h3 style="margin-bottom: 12px">
	{routes.find(x => x.path === $location)?.name || ''}
</h3>

<Router routes={renderedRoutes}/>

<style>
	
</style>