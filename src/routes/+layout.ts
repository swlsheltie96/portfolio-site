import type { LayoutLoad } from './$types';
import { sanityClient } from '$lib/sanity/client';
import { siteSettingsQuery, projectsListQuery, projectOrderedSlugsQuery } from '$lib/sanity/queries';

export const load: LayoutLoad = async () => {
	const [siteSettings, projects, orderedSlugs] = await Promise.all([
		sanityClient.fetch(siteSettingsQuery),
		sanityClient.fetch(projectsListQuery),
		sanityClient.fetch(projectOrderedSlugsQuery)
	]);
	return { siteSettings, projects, orderedSlugs };
};
