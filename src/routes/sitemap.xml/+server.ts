import type { RequestHandler } from './$types';
import { sanityClient } from '$lib/sanity/client';
import { projectOrderedSlugsQuery } from '$lib/sanity/queries';

export const GET: RequestHandler = async ({ url }) => {
	const slugs: string[] = await sanityClient.fetch(projectOrderedSlugsQuery);

	const urls = [url.origin, ...slugs.map((slug) => `${url.origin}/projects/${slug}`)];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
