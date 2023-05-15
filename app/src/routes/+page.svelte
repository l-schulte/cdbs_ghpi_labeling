<script lang="ts">
	import '@picocss/pico';
	import { getCookie, setCookie } from 'typescript-cookie';

	let userToken = getCookie('userToken');

	function storeUserToken() {
		if (userToken) {
			setCookie('userToken', userToken);
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
			value={userToken}
			placeholder="8bfd70e0-7726-48de..."
			required
		/>
		<small>We'll never share your email with anyone else.</small>

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
