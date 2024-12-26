<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { createShoppingList, shoppingListExists } from '$lib/ShoppingList';

	let listName = '';
	let isValidListName = false;
	let warningVisible = false;
	let btnClass = 'is-success';

	$: listName, validateShoppingListName();

	function validateShoppingListName() {
		warningVisible = false;
		isValidListName = false;
		btnClass = 'is-success';

		if (listName.length != 0 && !shoppingListExists(listName)) {
			isValidListName = true;
		} else if (shoppingListExists(listName)) {
			warningVisible = true;
			btnClass = 'is-danger';
		}
	}

	function createList() {
		if (!isValidListName) {
			btnClass = 'is-danger';
			return;
		}

		if (createShoppingList(listName)) {
			window.location.href = `${base}/list?name=${listName}`;
		}
	}
</script>

<section class="section">
	<div class="container">
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-full has-text-centered">
				<a href="{base}/" class="title">GE CART</a>
				<p class="subtitle">
					Create <strong>Grand Exchange</strong> shopping lists!
				</p>
			</div>
		</div>
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-four-fifths">
				<div class="field is-horizontal">
					<div class="field-body">
						<div class="field">
							<input
								class="input"
								type="text"
								placeholder="Create a new shopping list"
								name="id"
								id="id"
								bind:value={listName}
							/>
						</div>
						<div class="field is-narrow">
							<p class="control">
								<button 
									name="create"
									aria-label="Create shopping list"
									class="button {btnClass} is-dark is-outlined"
									onclick={createList}>
									Create
								</button>
							</p>
						</div>
					</div>
				</div>
				{#if warningVisible}
				<p class="help is-danger">Shopping list "{listName}" already exists</p>
				{/if}
			</div>
		</div>
	</div>
</section>
