<script lang="ts">
	import '@picocss/pico';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Cookies from 'js-cookie';
	import IssueOverview from '../../shared/issueOverview.svelte';
	import Labeler from './labeler.svelte';

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
	<div class="wrapper">
		<div class="content">
			<IssueOverview {data} />
			<Labeler {data} />
		</div>
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

	.wrapper {
		min-height: 100vh;

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
	}
</style>
