<script>
	/** https://github.com/pstanoev/simple-svelte-autocomplete */
	import AutoComplete from "simple-svelte-autocomplete";
	import { page } from "$app/stores";
	import { base } from '$app/paths';
	import { getMappingData, getPricesData } from "$lib/DataHandler";
	import { 
		ShoppingListItem,
		getItemImageUrl,
		shoppingListExists,
		getAllListItems,
		getItemsTotalPrice,
		updateItems,
		addItem
	} from "$lib/ShoppingList";

	let selectedItem, priceText;
	const listName = $page.url.searchParams.get('name');
	let items = getAllListItems(listName);
	
	$: items, onItemsChange();
	$: selectedItem, onSelectedItemChange();

	function onItemsChange() {
		updateItems(listName, items);

		const total = getItemsTotalPrice(items);

		if (total < 1) {
			priceText = 'is empty';
		} else {
			priceText = `value ${total.toLocaleString()} gp!`;
		}
	}

	function increaseItemCount(item) {
		const index = items.findIndex(i => i.id == item.id);

		if (index != -1) {
			items[index].count++;
		}

		updateItems(listName, items);
	}

	function decreaseItemCount(item) {
		const index = items.findIndex(i => i.id == item.id);

		if (index != -1) {
			items[index].count--;
		}

		if (items[index].count < 1) {
			items.splice(index, 1);
		}

		updateItems(listName, items);
	}

	async function onSelectedItemChange() {
		if (!selectedItem) {
			return;
		}
		
		const prices = await getPricesData();
		if (!prices) {
			return;
		}

		const item = new ShoppingListItem();
		item.name = selectedItem.name;
		item.id = selectedItem.id;
		item.icon = selectedItem.icon;
		item.examine = selectedItem.examine;
		item.price = prices.data[selectedItem.id].high;
		item.count = 1;

		items = [...items, item];
		updateItems(listName, items);
	}

	function homePage() {
		window.location.href = `${base}/`;
	}
</script>

<svelte:head>
	<title>GE Cart - {listName}</title>
</svelte:head>

{#if shoppingListExists(listName)}
<section class="section">
	<div class="container">
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-full has-text-centered">
				<a href="{base}/" class="title">GE CART</a>
				<p class="subtitle">
					Shopping cart {priceText}
				</p>
			</div>
		</div>
		<div class="columns is-centered is-vcentered is-mobile">
			<div class="column is-full">
				<div class="box search-box">
					<h1>Search items from Grand Exchange</h1>
					<AutoComplete
					searchFunction="{getMappingData}"
					delay="300"
					localFiltering={true}
					labelFieldName="name"
					valueFieldName="id"
					maxItemsToShowInList={25}
					bind:selectedItem="{selectedItem}">
						<div slot="item" let:item let:label>
							<figure>
								<img src={getItemImageUrl(item.icon)} alt={item.examine} />
								{@html label}
							</figure>
						</div>
					</AutoComplete>
				</div>
			</div>
		</div>
	</div>
</section>

{#if items.length > 0}
<section class="section">
	<div class="container">
		<div class="box">
			<table class="table is-striped is-fullwidth is-hoverable">
				<thead>
					<tr>
						<th>Icon</th>
						<th>Name</th>
						<th>Price</th>
						<th>Count</th>
					</tr>
				</thead>
				<tbody>
					{#each Object.values(items) as item}
					<tr>
						<td>
							<figure>
								<img src={getItemImageUrl(item.icon)} alt={item.examine} />
							</figure>
						</td>
						<td title={item.examine}>{item.name}</td>
						<td>{(item.price * item.count).toLocaleString()}gp</td>
						<td>
							<div class="field has-addons">
								<div class="control">
									<button class="button" 
										on:click={() => decreaseItemCount(item)}
										aria-label="Remove item">
										<span class="icon">
											<i class="fas fa-minus"></i>
										</span>
									</button>
								</div>
								<div class="control has-text-centered">
									<input class="input has-text-centered" type="number" bind:value={item.count} on:change={() => updateItems(listName, items)} placeholder={item.count}/>
								</div>
								<div class="control">
									<button class="button" 
										on:click={() => increaseItemCount(item)}
										aria-label="Add item">
										<span class="icon">
											<i class="fas fa-plus"></i>
										</span>
									</button>
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
{/if}
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

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type=number] {
		appearance: textfield;
	}
</style>
