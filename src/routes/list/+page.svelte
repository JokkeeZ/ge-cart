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
		<div class="columns is-mobile is-centered is-vcentered">
			<div class="column has-text-centered">
				<a href="{base}/" class="title">GE CART</a>
				<p class="subtitle">
					Shopping cart {priceText}
				</p>
			</div>
		</div>
		<div class="columns is-mobile is-centered is-vcentered">
			<div class="column is-full">
				<div class="box">
					<AutoComplete
						searchFunction="{getMappingData}"
						delay="300"
						className="is-success hide-arrow"
						hideArrow={true}
						localFiltering={true}
						labelFieldName="name"
						valueFieldName="id"
						placeholder="Search items from Grand Exchange"
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
		<div class="fixed-grid has-1-cols">
			<div class="grid">
				{#each Object.values(items) as item}
				<div class="cell has-text-centered">
					<div class="box">
						<div class="fixed-grid has-4-cols has-3-cols-mobile">
							<div class="grid">
								<div class="cell">
									<figure>
										<img src={getItemImageUrl(item.icon)} alt={item.examine} />
									</figure>
								</div>
								<div class="cell is-hidden-mobile" title={item.examine}>{item.name}</div>
								<div class="cell" title="{item.price.toLocaleString()} per item">{(item.price * item.count).toLocaleString()}gp</div>
								<div class="cell">
									<div class="field has-addons">
										<div class="control">
											<button class="button is-small"
												on:click={() => decreaseItemCount(item)}
												aria-label="Remove item">
												<span class="icon">
													<i class="fas fa-minus"></i>
												</span>
											</button>
										</div>
										<div class="control">
											<input 
												class="input is-small has-text-centered"
												type="number"
												bind:value={item.count}
												on:change={() => updateItems(listName, items)}
												placeholder={item.count}/>
										</div>
										<div class="control">
											<button class="button is-small"
												on:click={() => increaseItemCount(item)}
												aria-label="Add item">
												<span class="icon">
													<i class="fas fa-plus"></i>
												</span>
											</button>
										</div>
									</div>
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

<!-- {#if items.length > 0}
<div class="columns is-mobile is-centered is-vcentered">
	{#each Object.values(items) as item}
	<div class="column is-full has-text-centered">
		<div class="box">
			<div class="grid">
				<div class="cell">
					<figure>
						<img src={getItemImageUrl(item.icon)} alt={item.examine} />
					</figure>
				</div>
				<div class="cell" title={item.examine}>{item.name}</div>
				<div class="cell" title="{item.price.toLocaleString()} per item">{(item.price * item.count).toLocaleString()}gp</div>
				<div class="cell">
					<div class="field has-addons">
						<div class="control">
							<button class="button is-small"
								on:click={() => decreaseItemCount(item)}
								aria-label="Remove item">
								<span class="icon">
									<i class="fas fa-minus"></i>
								</span>
							</button>
						</div>
						<div class="control has-text-centered">
							<input 
								class="input is-small has-text-centered"
								type="number"
								bind:value={item.count}
								on:change={() => updateItems(listName, items)}
								placeholder={item.count}/>
						</div>
						<div class="control">
							<button class="button is-small"
								on:click={() => increaseItemCount(item)}
								aria-label="Add item">
								<span class="icon">
									<i class="fas fa-plus"></i>
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	{/each}
</div>
{/if} -->


<!-- {:else}
<section class="section">
	<div class="container">
		<div class="notification is-danger">
			<button class="delete" aria-label="close-page" on:click={homePage}></button>
			Shopping list <strong>{listName}</strong> could not be found.
		</div>
	</div>
</section>
{/if} -->

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
