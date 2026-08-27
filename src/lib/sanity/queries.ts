import groq from "groq";

export const projectsListQuery = groq`*[_type == "project"] | order(orderRank asc){ title, slug, coverImage, coverVideo, excerpt, year, categories, comingSoon, comingSoonText, gallery[hidden != true][0...5] }`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]{ title, slug, coverImage, excerpt, year, categories, gallery[hidden != true], stackGallery }`;

export const projectOrderedSlugsQuery = groq`*[_type == "project"] | order(orderRank asc).slug.current`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{ title, headerText, live, email, phone, address, instagramLink, arenaLink, linkedinLink, about, clientsAndCollaborators }`;

export const liveVideoUrlQuery = groq`*[_type == "siteSettings"][0].live.asset->url`;

export const recognitionQuery = groq`*[_type == "siteSettings"][0].recognition`;

export const newsListQuery = groq`*[_type == "news"] | order(date desc){ date, body }`;

export const allGalleryImagesQuery = groq`*[_type == "project"]{
  gallery[hidden != true && ((_type == "galleryImage" && defined(asset)) || (_type == "galleryImageUrl" && defined(url)))]{
    ...,
    "projectSlug": ^.slug.current
  }
}.gallery[]`;
