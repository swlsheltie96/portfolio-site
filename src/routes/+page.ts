import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { sanityClient } from '$lib/sanity/client';
import { newsListQuery } from '$lib/sanity/queries';
import { allGalleryImagesQuery } from '$lib/sanity/queries';
import { liveVideoUrlQuery } from '$lib/sanity/queries';
import { recognitionQuery } from '$lib/sanity/queries';
import { layouts, mobileDisabledLayouts } from '$lib/layouts';

export const load: PageLoad = async ({ parent }) => {
	const { projects } = await parent();
	const [news, galleryImages, live, recognition] = await Promise.all([
		sanityClient.fetch(newsListQuery),
		sanityClient.fetch(allGalleryImagesQuery),
		sanityClient.fetch(liveVideoUrlQuery),
		sanityClient.fetch(recognitionQuery)
	]);

	// Universal load re-runs client-side on hydration, where window is
	// available — the server pass (no window) always picks from the full set.
	const isMobile = browser && window.matchMedia('(max-width: 749px)').matches;
	const allIndices = layouts.map((_, i) => i);
	const pool = isMobile
		? allIndices.filter((i) => !mobileDisabledLayouts.includes(i))
		: allIndices;
	const layoutIndex = pool[Math.floor(Math.random() * pool.length)] ?? 0;

	return { projects, news, galleryImages, live, recognition, layoutIndex };

};
