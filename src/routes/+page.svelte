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
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-full has-text-centered">
				<a href="{base}/" class="title">GE CART</a>
				<p class="subtitle">
					Create <strong>Grand Exchange</strong> shopping lists!
				</p>
			</div>
		</div>
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-three-fifths">
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
									class="button {btnClass} is-dark is-outlined"
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
</section>

{#if lists.length > 0}
<section class="section">
	<div class="container">
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-three-fifths">
				<table class="table is-striped is-fullwidth is-hoverable">
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each Object.values(lists) as list}
						<tr>
							<td>{list.name}</td>
							<td>{list.price.toLocaleString()}gp</td>
							<td>
								<a href="{base}/list?name={list.name}" class="button is-dark is-success is-outlined">
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
							</td>
						</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>
{/if}
