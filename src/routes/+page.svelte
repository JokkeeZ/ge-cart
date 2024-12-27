<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { createShoppingList, getAllLists, shoppingListExists } from '$lib/ShoppingList';

	let listName = '';
	let warningText = null;
	let isValidListName = false;
	let warningVisible = false;
	let btnClass = 'is-success';
	let lists = getAllLists();

	$: listName, validateShoppingListName();

	function validateShoppingListName() {
		warningVisible = false;
		isValidListName = false;
		warningText = null;
		btnClass = 'is-success';

		if (shoppingListExists(listName)) {
			warningVisible = true;
			btnClass = 'is-danger';
			warningText = `Shopping list ${listName} already exists`;
		} else if (listName.includes('_')) {
			warningVisible = true;
			btnClass = 'is-danger';
			warningText = `Shopping list cannot contain underscores`;
		} else if (listName.length != 0 && !shoppingListExists(listName)) {
			isValidListName = true;
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

	function deleteList(name) {
		localStorage.removeItem(name);
		const index = lists.findIndex(i => i.name == name);

		if (index != -1) {
			lists.splice(index, 1);
		}

		lists = lists;
	}
</script>

<svelte:head>
	<title>GE Cart - Home</title>
</svelte:head>

<section class="section">
	<div class="container">

		<div class="columns is-mobile is-centered is-vcentered">
			<div class="column has-text-centered">
				<a href="{base}/" class="title">GE CART</a>
				<p class="subtitle">
					Create <strong>Grand Exchange</strong> shopping lists!
				</p>
			</div>
		</div>

		<div class="columns is-mobile">
			<div class="column is-full has-text-centered">
				<div class="box">
					<div class="field is-horizontal">
						<div class="field-body">
							<div class="field">
								<input
									class="input"
									type="text"
									placeholder="Give name for your shopping list"
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
										class="button {btnClass} is-outlined"
										onclick={createList}>
										<span class="icon-text">
											<span class="icon">
												<i class="fas fa-plus"></i>
											</span>
											<span>Create</span>
										</span>
									</button>
								</p>
							</div>
						</div>
					</div>
					{#if warningVisible}
					<p class="help is-danger">{warningText}</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

{#if lists.length > 0}
<section class="section">
	<div class="container">
		<div class="fixed-grid has-1-cols">
			<div class="grid">
				{#each Object.values(lists) as list}
				<div class="cell has-text-centered">
					<div class="box">
						<div class="fixed-grid has-3-cols has-1-cols-mobile">
							<div class="grid">
								<div class="cell" title={list.name}>
									<strong>{list.name}</strong>
								</div>
								<div class="cell">{list.price.toLocaleString()}gp</div>
								<div class="cell">
									<a href="{base}/list?name={list.name}" class="button is-success is-outlined">
										<span class="icon-text">
											<span class="icon">
												<i class="fas fa-eye"></i>
											</span>
											<span>View</span>
										</span>
									</a>
									<button 
										class="button is-danger is-success is-outlined"
										onclick={() => deleteList(list.name)}>
										<span class="icon-text">
											<span class="icon">
												<i class="fas fa-trash"></i>
											</span>
											<span>Delete</span>
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/each}
			</div>
		</div>
	</div>
</section>
{/if}
