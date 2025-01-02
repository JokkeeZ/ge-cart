import { base } from '$app/paths';
import { shoppingListExists, ShoppingListItem } from './ShoppingList';
import { getMappingData, getPricesData } from './DataHandler';

/**
 * @param {String} name 
 * @param {ShoppingListItem[]} items 
 * @returns {String}
 */
export function generateLink(name, items) {
	const ids = items.reduce((acc, item) => {
		acc[item.id] = item.count;
		return acc;
	}, {});

	const url = new URL(`${window.location.origin}${base}/list`);
	url.searchParams.set('name', name);
	url.searchParams.set('shared', new URLSearchParams(ids));
	return url;
};

export async function parseLink(shared) {
	const url = new URL(window.location.href);

	const ids = url.searchParams.get('shared');
	if (!ids) {
		return null;
	}

	const params = new URLSearchParams(ids);
	
	
	const mappingData = await getMappingData();
	if (!mappingData) {
		return null;
	}
	
	const pricesData = await getPricesData();
	if (!pricesData) {
		return null;
	}

	/** @type {ShoppingListItem[]} */
	const items = [];

	params.forEach((value, key) => {
		const itemData = mappingData.filter(i => i.id == parseInt(key));

		if (itemData) {
			const item = new ShoppingListItem();
			item.name = itemData[0].name;
			item.id = parseInt(key);
			item.icon = itemData[0].icon;
			item.examine = itemData[0].examine;
			item.price = pricesData.data[key].high;
			item.count = value;
			items.push(item);
		}
	});

	return items;
};
