<script lang="ts">
	import '@picocss/pico';
	import { page } from '$app/stores';
</script>

<head>
	<title>Error {$page.status}</title>
</head>
<body>
	<h1>Error {$page.status} - {$page.error?.message}</h1>
</body>

<style>
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
	h1 {
		font-size: 3rem;
		text-align: center;
	}
</style>
