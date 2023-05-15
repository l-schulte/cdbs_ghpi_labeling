<script lang="ts">
	import '@picocss/pico';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';

	let userToken = Cookies.get('userToken') ?? null;

	onMount(() => {
		if (userToken) {
			window.open(`/tool`, '_self');
		} else {
			window.open(`/login`, '_self');
		}
	});
</script>
