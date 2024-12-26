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
 * Creates a new shopping list and saves it to localStorage.
 *
 * @param {string} name The name of the shopping list to create.
 * @returns {boolean} `true` if the shopping list was successfully created (did not already exist), 
 * otherwise `false`.
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
 * Retrieves all items from a specified shopping list by its name.
 * 
 * @param {String} name The name of the shopping list to retrieve items from.
 * @returns {ShoppingListItem[]} An array of items from the specified shopping list.
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
 * @param {ShoppingListItem[]} items 
 * @param {ShoppingListItem} item 
 */
export function addItem(name, items, item) {
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
 * Checks if a shopping list with the given name exists.
 *
 * @param {string} name The name of the shopping list to check.
 * @returns {boolean} `true` if a shopping list with the given name exists, otherwise `false`.
 */
export function shoppingListExists(name) {
	return localStorage.getItem(name) != null;
};

/**
 * Converts an image name to an osrs wiki image URL.
 *
 * @param {string} img The name of the image to convert.
 * @returns {string} The generated URL for the image on the osrs wiki.
 */
export function getItemImageUrl(img) {
	img = encodeURIComponent(img.replaceAll(' ', '_')).replace(/[!'()*]/g, function(c) {
		return '%' + c.charCodeAt(0).toString(16);
	});

	return `https://oldschool.runescape.wiki/images/${img}?cache`;
};

/**
 * @param {ShoppingListItem[]} items Array of items
 * @returns {number} The total price of the shopping list, or `0` if the calculation fails.
 */
export function getItemsTotalPrice(items) {
	const sum = items.reduce((n, {price, count}) => n + (price * count), 0);
	return sum ? sum : 0;
};
