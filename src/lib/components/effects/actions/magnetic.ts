import type { Action } from 'svelte/action';

export const magnetic: Action<HTMLElement> = (node) => {
	const onEnter = () => node.classList.add('is-hover');
	const onLeave = () => node.classList.remove('is-hover');

	node.addEventListener('pointerenter', onEnter);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			node.removeEventListener('pointerenter', onEnter);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
};
