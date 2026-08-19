import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { sanityClient } from "$lib/sanity/client";
import { projectBySlugQuery } from "$lib/sanity/queries";

export const load: PageLoad = async ({ params, parent }) => {
  const { projects, orderedSlugs } = await parent();

  const project = await sanityClient.fetch(projectBySlugQuery, {
    slug: params.slug,
  });

  if (!project) {
    error(404, "Project not found");
  }

  const index = orderedSlugs.indexOf(params.slug) + 1;

  return { project, index, projects };
};
