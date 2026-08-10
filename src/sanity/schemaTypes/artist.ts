import { defineField, defineType } from "sanity";

export const artist = defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. London, or Delhi / London",
    }),
    defineField({
      name: "discipline",
      title: "Discipline",
      type: "string",
      description: "e.g. Painting, or Textile & Installation",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternative text" }],
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "blockContent",
    }),
    defineField({
      name: "practice",
      title: "Practice statement",
      type: "text",
      rows: 4,
      description: "Short statement on the artist's practice/approach",
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "exhibitions",
      title: "Exhibition history",
      type: "array",
      of: [
        {
          type: "object",
          name: "exhibitionEntry",
          fields: [
            { name: "year", type: "string", title: "Year" },
            { name: "title", type: "string", title: "Title" },
            { name: "venue", type: "string", title: "Venue" },
            {
              name: "type",
              type: "string",
              title: "Type",
              options: { list: ["Solo", "Group"] },
            },
          ],
          preview: {
            select: { title: "title", subtitle: "venue", year: "year" },
            prepare({ title, subtitle, year }) {
              return { title: `${year ? `${year} — ` : ""}${title}`, subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [{ type: "string" }],
      description: "Notable public/private collections holding this artist's work",
    }),
    defineField({
      name: "awards",
      title: "Awards & Residencies",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. \"2016 — Marmite Prize, London, UK\"",
    }),
    defineField({
      name: "teaching",
      title: "Teaching & Academic Engagement",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. \"2021–2025 — Art Educator, Shiv Nadar School, Gurgaon, India\"",
    }),
    defineField({
      name: "press",
      title: "Press & publications",
      type: "array",
      of: [
        {
          type: "object",
          name: "pressEntry",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "publication", type: "string", title: "Publication" },
            { name: "date", type: "date", title: "Date" },
            { name: "url", type: "url", title: "URL" },
          ],
          preview: {
            select: { title: "title", subtitle: "publication" },
          },
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "discipline", media: "portrait" },
  },
});
