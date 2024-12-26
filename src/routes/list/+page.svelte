<script>
	/** https://github.com/pstanoev/simple-svelte-autocomplete */
	import AutoComplete from "simple-svelte-autocomplete";
	import { page } from "$app/stores";
	import { base } from '$app/paths';
	import { lazyLoad } from "$lib/LazyLoad";
	import { getMappingData, getPricesData } from "$lib/DataHandler";
	import { 
		ShoppingListItem, getItemImageUrl, 
		shoppingListExists, addOrUpdateItem, 
		getAllListItems, removeOrUpdateItem, 
		getListTotalPrice 
	} from "$lib/ShoppingList";

	let selectedItem;
	const listName = $page.url.searchParams.get('name');
	let items = getAllListItems(listName);
	let priceText = getListTotalPrice(listName).toLocaleString();

	$: selectedItem, onSelectedItemChange();

	async function onSelectedItemChange() {
		if (!selectedItem) {
			return;
		}

		const pricesData = await getPricesData();
		if (!pricesData) {
			return;
		}

		const priceItem = pricesData.data[selectedItem.id];

		const item = new ShoppingListItem();
		item.name = selectedItem.name;
		item.id = selectedItem.id;
		item.icon = selectedItem.icon;
		item.examine = selectedItem.examine;
		item.price = priceItem.high;
		item.count = 1;

		if (addOrUpdateItem(listName, item)) {
			console.log('Item added successfully!');
		} else {
			console.log('Failed to add item.');
		}

		refreshItems();
	}

	function refreshItems() {
		const allItems = getAllListItems(listName);

		if (allItems) {
			// TODO: update item prices if they're old
			items = allItems;
			priceText = getListTotalPrice(listName).toLocaleString();
		}
	}

	function removeItem(item) {
		if (!item) {
			console.log(`[Remove] - item was ${item}`);
			return;
		}

		if (removeOrUpdateItem(listName, item)) {
			console.log('Item removed successfully!');
		} else {
			console.log('Failed to remove item.');
		}

		refreshItems();
	}

	function updateItem(item) {
		if (!item) {
			console.log(`[Update] - item was ${item}`);
			return;
		}

		if (addOrUpdateItem(listName, item)) {
			console.log('Item added successfully!');
		} else {
			console.log('Failed to add item.');
		}

		refreshItems();
	}

	function homePage() {
		window.location.href = `${base}/`;
	}
</script>

{#if shoppingListExists(listName)}
<section class="section">
	<div class="container">
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-full has-text-centered">
				<a href="{base}/" class="title">GE CART</a>
				<p class="subtitle">
					Shopping cart value <strong class="is-success">{priceText}</strong>gp
				</p>
			</div>
		</div>
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-full">
				<div class="box search-box">
					<h1>Add item to the list</h1>
					<AutoComplete
					searchFunction="{getMappingData}"
					delay="300"
					localFiltering={true}
					labelFieldName="name"
					valueFieldName="id"
					bind:selectedItem="{selectedItem}">
				  
					<div slot="item" let:item let:label>
						<img use:lazyLoad={getItemImageUrl(item.icon)} alt={item.examine} />
						{@html label}
					</div>
				  </AutoComplete>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="box">
			<table class="table is-striped is-fullwidth is-hoverable">
				<thead>
					<tr>
						<th>Icon</th>
						<th>Name</th>
						<th>Price</th>
						<th>Controls</th>
					</tr>
				</thead>
				<tbody>
					{#each Object.values(items) as row}
					<tr>
						<td><img use:lazyLoad={getItemImageUrl(row.icon)} alt={row.examine} /></td>
						<td title={row.examine}>{row.name}</td>
						<td>{(row.price * row.count).toLocaleString()}gp</td>
						<td>
							<div class="field has-addons">
								<div class="control">
									<button class="button" on:click={() => removeItem(row)}>-</button>
								</div>
								<div class="control has-text-centered">
									<input class="input count-input has-text-centered" type="text" placeholder="{row.count}"/>
								  </div>
								  <div class="control">
									<button class="button" on:click={() => updateItem(row)}>+</button>
								</div>
							</div>
						</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

{:else}
<section class="section">
	<div class="container">
		<div class="notification is-danger">
			<button class="delete" aria-label="close-page" on:click={homePage}></button>
			Shopping list <strong>{listName}</strong> could not be found.
		</div>
	</div>
</section>
{/if}

<style>
	.search-box :global(.autocomplete-list) {
		background-color: hsl(221, 14%, calc(9% + 0%));
		border: 1px solid hsl(221, 14%, calc(24% + 0%));
	}

	.search-box :global(.autocomplete-list-item) {
		color: var(--bulma-text);
	}
</style>
