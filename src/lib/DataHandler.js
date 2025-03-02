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
 * @returns {Promise<Object>}
 */
export async function getMappingData() {
	return await getData('mapping_data', 'https://prices.runescape.wiki/api/v1/osrs/mapping');
};

/**
 * @returns {Promise<Object>}
 */
export async function getPricesData() {
	return await getData('prices_data', 'https://prices.runescape.wiki/api/v1/osrs/latest');
};

/**
 * @param {string} key
 * @param {string} url
 * @returns
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
		if (localStorage.getItem('accepted_usage')) {
			localStorage.setItem(key, JSON.stringify(result));
			localStorage.setItem(key + '_expiry', currentTime);
		}
	});

	return JSON.parse(localStorage.getItem(key));
};
