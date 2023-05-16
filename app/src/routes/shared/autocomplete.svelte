<script lang="ts">
	export let formName: string;
	export let value: string;
	export let options: string[];

	function getMatch(searchString: string, list: string[]): string {
		const regex = new RegExp(searchString.toLowerCase().split('').join('.*?'), 'i');
		return list.find((str) => regex.test(str)) ?? 'other';
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key == 'Tab') {
			const match = getMatch(value.length ? value : formName, options);
			if (value != match) {
				event.preventDefault();
				value = match;
			}
		}
	}
</script>

<div class="input-wrapper">
	<input
		type="text"
		id="autocomplete_{formName}"
		name={formName}
		bind:value
		on:keydown={handleKeyPress}
	/>
	<div class="typeahead">{getMatch(value.length ? value : formName, options)} (TAB)</div>
</div>

<style lang="scss">
	.input-wrapper {
		display: flex;
		align-items: center;
		position: relative;
		width: 50%;

		input {
			margin: 0px;
		}

		.typeahead {
			position: absolute;
			right: 15px;
			color: grey;
		}
	}
</style>
