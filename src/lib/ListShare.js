export function generateLink(name, items) {
	const b64 = btoa(JSON.stringify(items));
	return `${window.location.origin}/list?name=${name}&shared=${b64}`;
};

export function parseLink(shared) {
	try {
		const items = JSON.parse(atob(shared));
		
		if (Array.isArray(items)) {
			return items;
		}
	}
	catch {}

	return null;
};
