import type { Action } from 'svelte/action';

// Autoplay <video> elements keep decoding frames even when scrolled far off
// screen, and this site has several on one page at once (gallery items,
// project cover previews, list rows). That's a common cause of mobile
// Safari (and memory-constrained desktop Safari) silently killing and
// reloading the tab. Pausing playback once a video leaves the viewport and
// resuming it once it's back in view keeps only on-screen videos decoding.
export const pauseOffscreen: Action<HTMLVideoElement> = (node) => {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.play().catch(() => {});
			} else {
				node.pause();
			}
		},
		{ rootMargin: '200px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
