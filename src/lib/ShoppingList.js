/**
 * Template for shopping list items.
 */
export class ShoppingListItem
{
	constructor() {
		/** @type {String} */
		this.name = '';
		/** @type {number} */
		this.id = 0;
		/** @type {String} */
		this.icon = '';
		/** @type {String} */
		this.examine = '';
		/** @type {number} */
		this.price = 0;
		/** @type {number} */
		this.count = 0;
	}
};

/**
 * @returns {{name: string, price: number}[]}
 */
export function getAllLists() {
	const lists = [];
	const listNames = Object.entries(localStorage);

	for (var name in listNames) {
		const key = localStorage.key(name);
		if (key.includes('_')) {
			continue;
		}

		/** @type {ShoppingListItem[]} */
		const items = JSON.parse(localStorage.getItem(key));
		if (!items) {
			continue;
		}

		let price = 0;

		if (items.length > 0) {
			price = getItemsTotalPrice(items);
		}

		lists.push({ name: key, price: price });
	}

	return lists;
}

/**
 * @param {string} name
 * @returns {boolean}
 */
export function createShoppingList(name) {
	if (shoppingListExists(name)) {
		return false;
	}

	localStorage.setItem(name, JSON.stringify([]));

	console.log(`[${name}] - Shopping list created.`);
	return true;
};

/**
 * @param {String} name
 * @returns {ShoppingListItem[]}
 */
export function getAllListItems(name) {
	const list = localStorage.getItem(name);

	if (!list) {
		console.log('[getAllListItems] failed - list is null.');
		return [];
	}

	const items = JSON.parse(list);
	return items ? items : [];
};

/**
 * @param {String} name 
 * @param {ShoppingListItem[]} items 
 * @param {ShoppingListItem[} item 
 */
export function addItemToList(name, items, item) {
	const index = items.findIndex(i => i.id == item.id);

	if (index == -1) {
		items.push(item);
	}

	updateItems(name, items);
};

/**
 * @param {String} name 
 * @param {ShoppingListItem[]} items 
 */
export function updateItems(name, items) {
	if (!shoppingListExists(name)) {
		return false;
	}

	localStorage.setItem(name, JSON.stringify(items));
	return true;
};

/**
 * @param {string} name
 * @returns {boolean}
 */
export function shoppingListExists(name) {
	return localStorage.getItem(name) != null;
};

/**
 * @param {string} img
 * @returns {string}
 */
export function getItemImageUrl(img) {
	img = encodeURIComponent(img.replaceAll(' ', '_')).replace(/[!'()*]/g, function(c) {
		return '%' + c.charCodeAt(0).toString(16);
	});

	return `https://oldschool.runescape.wiki/images/${img}?cache`;
};

/**
 * @param {ShoppingListItem[]} items
 * @returns {number}
 */
export function getItemsTotalPrice(items) {
	if (!Array.isArray(items)) {
		return 0;
	}

	const sum = items.reduce((n, {price, count}) => n + (price * count), 0);
	return sum ? sum : 0;
};
