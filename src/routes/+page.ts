import type { PageLoad } from './$types';
import { sanityClient } from '$lib/sanity/client';
import { newsListQuery } from '$lib/sanity/queries';
import { allGalleryImagesQuery } from '$lib/sanity/queries';
import { liveVideoUrlsQuery } from '$lib/sanity/queries';
import { recognitionQuery } from '$lib/sanity/queries';

export const load: PageLoad = async ({ parent }) => {
	const { projects } = await parent();
	const [news, galleryImages, liveVideoUrls, recognition] = await Promise.all([
		sanityClient.fetch(newsListQuery),
		sanityClient.fetch(allGalleryImagesQuery),
		sanityClient.fetch(liveVideoUrlsQuery),
		sanityClient.fetch(recognitionQuery)
	]);

	return { projects, news, galleryImages, liveVideoUrls, recognition };
};
