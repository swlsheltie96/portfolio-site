import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

function isGifAsset(source: SanityImageSource): boolean {
	const ref =
		typeof source === 'object' && source !== null && 'asset' in source
			? (source as { asset?: { _ref?: string } }).asset?._ref
			: undefined;
	return typeof ref === 'string' && ref.endsWith('-gif');
}

// Caps width and picks an optimal format for regular photos. GIFs are left
// untouched — any transform param (including width) flattens their animation.
export function optimizedUrlFor(source: SanityImageSource, width: number): string {
	if (isGifAsset(source)) {
		return builder.image(source).url();
	}
	return builder.image(source).width(width).auto('format').url();
}

const RESPONSIVE_WIDTHS = [400, 800, 1200, 1600, 2400];

// Builds a srcset so the browser can pick the resolution that matches how
// wide the image actually renders, instead of always fetching one fixed
// size. Returns undefined for GIFs — no transform params means no srcset,
// same reasoning as optimizedUrlFor.
export function srcSetFor(
	source: SanityImageSource,
	widths: number[] = RESPONSIVE_WIDTHS
): string | undefined {
	if (isGifAsset(source)) return undefined;
	return widths
		.map((w) => `${builder.image(source).width(w).auto('format').url()} ${w}w`)
		.join(', ');
}
