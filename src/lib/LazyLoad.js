const options = {
	root: null,
	rootMargin: '0px',
	threshold: 0
};

export function lazyLoad(image, src) {
	const loaded = () => {
		image.style.opacity = "1";
	};

	const observer = new IntersectionObserver(entries => {
		if (entries[0].isIntersecting) {
			console.log('[LazyLoad] - an image has loaded');
			image.src = src;
			if (image.complete) {
				loaded();
			} else {
				image.addEventListener('load', loaded);
			}
		}
	}, options);

	observer.observe(image);

	return {
		destroy() {
			image.removeEventListener('load', loaded);
		}
	};
};
