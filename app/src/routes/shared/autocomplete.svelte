<script lang="ts">
	export let formName: string;
	export let value: string;
	export let options: string[];
	export let required: boolean = false;

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
			autocomplete="off"
			{required}
		/>
		<div class="typeahead">
			<div class="prediction">{getMatch(value.length ? value : formName, options)}</div>
			<div>&nbsp;(TAB)</div>
		</div>
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
				.prediction {
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				position: absolute;
				right: 15px;
				color: grey;
				max-width: 30%;
				display: flex;
			}
		}
	}
</style>
