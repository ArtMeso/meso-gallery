import { groq } from "next-sanity";

export const artistCardFields = groq`
  _id,
  name,
  "slug": slug.current,
  location,
  discipline,
  portrait,
  featured
`;

export const allArtistsQuery = groq`
  *[_type == "artist"] | order(name asc) {
    ${artistCardFields}
  }
`;

export const featuredArtistQuery = groq`
  *[_type == "artist" && featured == true] | order(_createdAt desc)[0] {
    ${artistCardFields},
    practice
  }
`;

export const artistBySlugQuery = groq`
  *[_type == "artist" && slug.current == $slug][0] {
    ${artistCardFields},
    bio,
    practice,
    education,
    exhibitions,
    collections,
    awards,
    teaching,
    press
  }
`;

export const allArtistSlugsQuery = groq`
  *[_type == "artist" && defined(slug.current)][].slug.current
`;

// Sitemap needs the real edit timestamp alongside the slug: a <lastmod> that
// says "today" on every URL every day is a signal Google learns to discount.
export const artistSitemapEntriesQuery = groq`
  *[_type == "artist" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

export const articleCardFields = groq`
  _id,
  title,
  "slug": slug.current,
  author,
  date,
  category,
  excerpt,
  featuredImage
`;

export const latestArticlesQuery = groq`
  *[_type == "article"] | order(date desc)[0...$limit] {
    ${articleCardFields}
  }
`;

export const allArticlesQuery = groq`
  *[_type == "article"] | order(date desc) {
    ${articleCardFields}
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    ${articleCardFields},
    body,
    seo,
    faq,
    relatedArtists[]-> {
      ${artistCardFields}
    }
  }
`;

export const allArticleSlugsQuery = groq`
  *[_type == "article" && defined(slug.current)][].slug.current
`;

export const articleSitemapEntriesQuery = groq`
  *[_type == "article" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc, name asc) {
    _id,
    name,
    role,
    bio,
    portrait
  }
`;
