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

<div class="autocomplete-wrapper">
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
	<details class="dropdown" role="list" dir="rtl">
		<summary aria-haspopup="listbox" role="link" />
		<ul class="dropdown-popup" role="listbox">
			{#each options as option}
				<li>
					<a
						on:click={() => {
							value = option;
						}}
					>
						{option}
					</a>
				</li>
			{/each}
		</ul>
	</details>
</div>

<style lang="scss">
	.autocomplete-wrapper {
		width: 100%;
		display: flex;
		margin-bottom: 15px;

		.dropdown {
			align-self: center;
			margin: 5px;

			.dropdown-popup {
				min-width: 300px;
				max-height: 300px;
				overflow-y: scroll;
			}
		}
		.input-wrapper {
			display: flex;
			align-items: center;
			position: relative;
			width: 100%;

			input {
				margin: 0px;
			}

			.typeahead {
				position: absolute;
				right: 15px;
				color: grey;
			}
		}
	}
</style>
