<script lang="ts">
	import '@picocss/pico';
	import Cookies from 'js-cookie';

	$: userToken = Cookies.get('userToken') ?? null;
	console.log(userToken);

	function storeUserToken() {
		console.log(userToken);
		if (userToken) {
			Cookies.set('userToken', userToken);
			window.open(`/tool`, '_self');
		}
	}
</script>

<div class="form-wrapper">
	<form>
		<!-- Markup example 2: input is after label -->
		<label for="userToken">User Token:</label>
		<input
			id="userToken"
			name="userToken"
			placeholder="8bfd70e0-7726-48de..."
			bind:value={userToken}
			required
		/>

		<!-- Button -->
		<button type="button" on:click={storeUserToken}>Go</button>
	</form>
</div>

<style lang="scss">
	.form-wrapper {
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
