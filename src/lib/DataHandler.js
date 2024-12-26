import { ShoppingListItem } from "./ShoppingList";

/**
 * @type {number} Cache expires in 10 minutes.
 */
const CACHE_EXPIRY_TIME = 10 * 60 * 1000;

/**
 * @type {Headers} Headers for GET request to prices.runescape.wiki api.
 */
const headers = new Headers({
	'Accept'       : 'application/json',
	'Content-Type' : 'application/json',
	'User-Agent'   : 'ge-cart - @JokkeeZ on Github'
});

/**
 * Fetches the latest item mappings from the osrs wiki API.
 *
 * @returns {Promise<Object>} A promise that resolves to the latest item mappings.
 */
export async function getMappingData() {
	return await getData('mapping_data', 'https://prices.runescape.wiki/api/v1/osrs/mapping');
};

/**
 * Fetches the latest item prices from the osrs wiki API.
 *
 * @returns {Promise<Object>} A promise that resolves to the latest item prices.
 */
export async function getPricesData() {
	return await getData('prices_data', 'https://prices.runescape.wiki/api/v1/osrs/latest');
};

/**
 * Fetches the latest data from the specified URL and caches it in localStorage as JSON using the given key.
 * If the cached data is older than 10 minutes, it will be fetched again; otherwise, data is retrieved from the cache.
 *
 * @param {string} key The name of the cache key where the request response will be stored in JSON format.
 * @param {string} url The URL from which to fetch the data.
 * @returns The retrieved or fetched shopping list item mappings or prices.
 */
async function getData(key, url) {
	const currentTime = Date.now();

	const cacheData = localStorage.getItem(key);
	const cacheExpiry = localStorage.getItem(key + '_expiry');

	if (cacheData && cacheExpiry) {
		if (currentTime - cacheExpiry < CACHE_EXPIRY_TIME) {
			console.log(`[${key}] - Using cached data`);
			return JSON.parse(cacheData);
		}
	}

	console.log(`[${key}] - Using new data.`);

	const response = await fetch(url, {
		method: 'GET',
		headers : headers
	})
	.then(result => result.json())
	.then(result => {
		localStorage.setItem(key, JSON.stringify(result));
		localStorage.setItem(key + '_expiry', currentTime);
	});

	return JSON.parse(localStorage.getItem(key));
};
