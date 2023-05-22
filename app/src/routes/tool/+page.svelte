<script lang="ts">
	import '@picocss/pico';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);
</script>

<!-- BODY -->

<div class="wrapper">
	<table role="grid">
		<thead>
			<tr>
				<th scope="col">Category</th>
				<th scope="col">Progress</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Issues related to privacy (verified so far)</td>
				<td>{data.numberOfPrivacyIssues} / {data.numberOfIssues}</td>
			</tr>
			<tr>
				<td>Issues not related to privacy (verified so far)</td>
				<td>{data.numberOfNonPrivacyIssues} / {data.numberOfIssues}</td>
			</tr>
			{#each data.userProgress as progress}
				<tr>
					<td>Issues coded ({progress[0]})</td>
					<td>{progress[1]} / {data.numberOfPrivacyIssues}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<a href="/tool/label" role="button">Coding</a>
	<a href="/tool/harmonize" role="button">Validating</a>
</div>

<!-- STYLE -->

<style lang="scss">
	.wrapper {
		position: absolute;
		bottom: 30%;
		left: 25%;
		width: 50%;

		a {
			width: 100%;
			margin-bottom: 15px;
		}
	}
</style>
