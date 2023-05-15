<script lang="ts">
	import '@picocss/pico';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Cookies from 'js-cookie';
	import { enhance } from '$app/forms';
	import IssueOverview from '../shared/issueOverview.svelte';
	import Harmonizer from '../shared/harmonizer.svelte';
	import Labeler from '../shared/labeler.svelte';

	export let data: PageData;
	let userToken = Cookies.get('userToken');

	onMount(() => {
		if (!userToken) {
			window.open(`/login`, '_self');
		}

		window.open(
			`https://github.com/${data.issue.project}/issues/${data.issue.number}`,
			'github',
			'popup=true,resize=true,width=600,height=400,left=200,top=200'
		);
	});

	async function nextIssue() {
		window.open(
			`/loading`,
			'github',
			'popup=true,resize=true,width=600,height=400,left=200,top=200'
		);
		window.location.href = '/tool';
	}
</script>

<!-- BODY -->

<nav>
	<ul>
		<li><strong>Privacy issues on GitHub</strong></li>
		<li>{data.user}</li>
	</ul>
	<ul>
		<li><a href="/help">Help</a></li>
	</ul>
</nav>

{#if data}
	<div class="content">
		<IssueOverview {data} />

		{#if data.issue.isPrivacyRelated == null}
			<Harmonizer {data} />
		{:else}
			<Labeler {data} />
		{/if}
	</div>
{:else}
	<div class="content loading">
		<a href="/help" aria-busy="true">Fetching data, please wait…</a>
	</div>
{/if}

<div class="navigation-wrapper">
	<button class="secondary" on:click={nextIssue}>Skip</button>
</div>

<!-- STYLE -->

<style lang="scss">
	:global(body) {
		margin: 0;
	}

	nav {
		position: sticky;
		top: 0;
		padding: 0 20px;
		background-color: var(--background-color);
	}

	.navigation-wrapper {
		position: sticky;
		bottom: 0px;
		padding: 10px;
		width: 100%;
		background-color: var(--background-color);
	}

	.content {
		display: flex;
		flex-wrap: wrap;

		padding: 10px;

		&.loading {
			height: 85vh;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
