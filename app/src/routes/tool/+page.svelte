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
				<td>Verified issues related to privacy</td>
				<td>{data.numberOfPricacyIssues}</td>
			</tr>
			{#each data.userProgress as progress}
				<tr>
					<td>Issues coded ({progress[0]})</td>
					<td>{progress[1]} / {data.numberOfIssues}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<a href="/tool/label" role="button">Labeling</a>
	<a href="/tool/harmonize" role="button">Harmonizing</a>
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
