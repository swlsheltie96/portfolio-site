import { createClient } from '@sanity/client';
import { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } from '$env/static/public';
import { SANITY_API_READ_TOKEN } from '$env/static/private';

export const sanityServerClient = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2026-01-01',
	useCdn: false,
	token: SANITY_API_READ_TOKEN
});
