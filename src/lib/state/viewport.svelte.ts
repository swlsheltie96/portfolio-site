import { browser } from '$app/environment';

const MOBILE_QUERY = '(max-width: 749px)';

class ViewportState {
	isMobile = $state(browser ? window.matchMedia(MOBILE_QUERY).matches : false);

	start() {
		if (!browser) return;

		const query = window.matchMedia(MOBILE_QUERY);
		this.isMobile = query.matches;
		query.addEventListener('change', (e) => {
			this.isMobile = e.matches;
		});
	}
}

export const viewportState = new ViewportState();
