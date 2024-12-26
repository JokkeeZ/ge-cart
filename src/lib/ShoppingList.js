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
 * Adds a new item to the specified shopping list or updates an existing item.
 *
 * @param {string} name The name of the shopping list where the item should be added or updated.
 * @param {ShoppingListItem} item The item to add or update.
 * @returns {boolean} `true` if the item was successfully added or updated, otherwise `false`.
 */
export function addOrUpdateItem(name, item) {
	const list = localStorage.getItem(name);

	if (!list) {
		console.log('[addOrUpdateItem] failed - list is null.');
		return false;
	}

	/** @type {ShoppingListItem[]} */
	const items = JSON.parse(list);
	const index = items.findIndex(i => i.id == item.id);

	if (index == -1) {
		items.push(item);
	} else {
		items[index].count++;
	}

	localStorage.setItem(name, JSON.stringify(items));
	return true;
};

/**
 * Updates the item count if more than one image exists; otherwise, removes the item from the shopping list.
 *
 * @param {string} name The name of the shopping list.
 * @param {ShoppingListItem} item The item to update or remove.
 * @returns {boolean} `true` if the operation was successful (item updated or removed), otherwise `false`.
 */
export function removeOrUpdateItem(name, item) {
	const list = localStorage.getItem(name);

	if (!list) {
		console.log('[removeOrUpdateItem] failed - list is null.');
		return false;
	}

	/** @type {ShoppingListItem[]} */
	const items = JSON.parse(list);
	const index = items.findIndex(i => i.id == item.id);

	if (index == -1) {
		console.log('[removeOrUpdateItem] failed - couldnt find index for item.');
		return false;
	}

	items[index].count--;

	if (items[index].count < 1) {
		items.splice(index, 1);
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
 * Calculates the total price of all items in the specified shopping list.
 * If the calculation fails, returns 0.
 *
 * @param {string} name The name of the shopping list to calculate the total price for.
 * @returns {number} The total price of the shopping list, or `0` if the calculation fails.
 */
export function getListTotalPrice(name) {
	const allItems = getAllListItems(name);

	if (!allItems) {
		console.log('[getListTotalPrice] failed - list is null.');
		return 0;
	}

	const sum = allItems.reduce((n, {price, count}) => n + (price * count), 0);
	return sum ? sum : 0;
};
