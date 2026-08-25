import { defineField, defineType } from "sanity";

export const ARTICLE_CATEGORIES = [
  "Market Intelligence",
  "Artist Spotlight",
  "Collecting Guide",
  "Exhibition Review",
  "Art Fair",
  "Press Release",
  "Events",
] as const;

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "MeSo Ventures",
    }),
    defineField({
      name: "date",
      title: "Publish date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: [...ARTICLE_CATEGORIES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternative text" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "relatedArtists",
      title: "Related artists",
      type: "array",
      of: [{ type: "reference", to: [{ type: "artist" }] }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      description:
        "Optional Q&A section rendered at the end of the article with FAQPage structured data — good for guide-style articles that target question-shaped searches.",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqEntry",
          fields: [
            defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "answer", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta title" },
        { name: "metaDescription", type: "text", rows: 2, title: "Meta description" },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "featuredImage" },
  },
});
