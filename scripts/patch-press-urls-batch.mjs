// One-off patch: attaches source URLs to press entries that had none (they were
// rendering as plain, unlinked text), corrects a handful of title/byline
// transcription errors found while sourcing them, and removes one entry whose
// source domain has been taken over by an unrelated site.
//
// Every URL here was found by search and verified against the live page, except
// where noted inline. Uses targeted _key-scoped sets so concurrent Studio edits
// to other fields are not clobbered.
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.SANITY_API_TOKEN) {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const match = line.match(/^SANITY_API_TOKEN=(.+)$/);
      if (match) process.env.SANITY_API_TOKEN = match[1].trim();
    }
  }
}

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_TOKEN. Set it in .env.local and re-run.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jncu3emy",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const url = (key, href) => [`press[_key=="${key}"].url`, href];
const field = (key, name, value) => [`press[_key=="${key}"].${name}`, value];

const patches = [
  {
    id: "artist-chiedu-okonta",
    label: "Chiedu Okonta",
    set: Object.fromEntries([
      url("pr0", "https://contemporarylynx.co.uk/artist-in-focus-chiedu-okonta"),
      url("pr2", "https://www.blowoutmagazine.com/blowout-art/2025/6/30/rca-degree-show-2025-highlights"),
      url("pr3", "https://www.maaspacebetween.com/diary/41-chiedu-okonta-a-space-between"),
    ]),
  },
  {
    id: "artist-jessie-makinson",
    label: "Jessie Makinson",
    set: Object.fromEntries([
      url("pr0", "https://galeriemagazine.com/9-standout-solo-gallery-shows-to-see-in-paris/"),
      url("pr1", "https://news.artnet.com/art-world/jessie-makinson-bad-sleeper-2388789"),
      url("pr2", "https://news.artnet.com/art-world/artists-to-watch-november-new-york-2387999"),
      url("pr3", "https://hypebae.com/2023/3/best-emerging-artists-international-womens-day-avant-arte"),
      url("pr4", "https://musemagazine.it/articles/jessie-makinson-en/"),
      url("pr5", "https://news.artnet.com/art-world/spotlight-simon-lee-gallery-machines-of-desire-2151715"),
      url("pr6", "https://www.itsnicethat.com/articles/jessie-makinson-art-070322"),
      url("pr9", "https://somethingcurated.com/2021/03/19/interview-painter-jessie-makinson-on-temper-tantrums-setting-the-scene/"),
      // Live piece is titled "9 ..." (not "7") and is dated 13 Oct 2020, not Jan 2021.
      url("pr10", "https://www.lvhart.co/journal/9-contemporary-female-painters-breathing-fresh-life-into-surrealism/"),
      field("pr10", "title", 'Ortiz Rapalo, Maria, "9 Contemporary Female Painters Breathing Fresh Life Into Surrealism"'),
      field("pr10", "date", "2020-10-13"),
      url("pr11", "https://gestalten.com/blogs/journal/jessie-makinsons-mythical-femininity-in-an-aberrant-world"),
      // Artsy headline spells the surname correctly: Makinson, not Mackinson.
      url("pr12", "https://www.artsy.net/article/artsy-editorial-jessie-makinsons-otherworldly-paintings-filled-enigmatic-tales"),
      field("pr12", "title", 'Alleyne, Allyssia, "Jessie Makinson’s Otherworldly Paintings Are Filled with Enigmatic Tales"'),
      url("pr13", "https://elephant.art/jessie-makinson-interview-painting-13072020/"),
      // NOTE: theguardian.com blocks our crawler, so this URL came from a gallery
      // press page rather than a direct page read. Worth a manual click-test.
      url("pr14", "https://www.theguardian.com/artanddesign/2020/jun/05/jessie-makinson-furry-darkness"),
      url("pr15", "https://www.itsnicethat.com/articles/jessie-makinson-art-101219"),
      url("pr16", "https://www.artnews.com/art-in-america/aia-reviews/jessie-makinson-posthuman-dreamworld-painting-omr-62707/"),
      // METAL's actual headline is "Fakes and Lies" (plural).
      url("pr17", "https://metalmagazine.eu/en/post/jessie-makinson-fakes-and-lies"),
      field("pr17", "title", 'Delmage, Lara, "Jessie Makinson: Fakes and Lies"'),
      url("pr19", "https://artefuse.com/2019/07/22/jessie-makinson-tender-trick-at-omr-gallery-mexico/"),
      url("pr20", "https://hifructose.com/2019/04/18/the-oil-and-watercolor-paintings-of-jessie-makinson/"),
    ]),
  },
  {
    id: "artist-osman-yousefzada",
    label: "Osman Yousefzada",
    set: Object.fromEntries([
      url("pr0", "https://canongate.co.uk/books/2495-the-go-between-a-portrait-of-growing-up-between-different-worlds/"),
      url("pr2", "https://www.ft.com/content/56e5192e-b259-4637-af94-c5520478b2d6"),
      url("pr4", "https://www.nytimes.com/2020/09/19/fashion/racism-LFW.html"),
      // Full Guardian headline ends "...coalition"; essay published 22 Nov 2020.
      url("pr5", "https://www.theguardian.com/society/2020/nov/22/osman-yousefzada-designer-and-writer-essay-on-tackling-race-in-britain-identity"),
      field("pr5", "title", '"Shades of unity, in hope of a new brown and black coalition"'),
      field("pr5", "date", "2020-11-22"),
    ]),
  },
  {
    id: "artist-tallulah-hutson",
    label: "Tallulah Hutson",
    set: Object.fromEntries([
      url("pr1", "https://www.artrenewal.org/16thARCSalon/artist/tallulah-hutson/29936"),
    ]),
  },
  {
    id: "artist-tiyana-mitchell",
    label: "Tiyana Mitchell",
    set: Object.fromEntries([
      url("pr0", "https://www.impulsemagazine.com/articles/tiyana-mitchell-what-light-remains-at-bulgari-and-meso-ventures"),
      url("pr1", "https://www.jdeedmagazine.com/news/hayaty-diaries-presents-secondskin----an-exhibition-about-touch-memory-and-the-stories-we-carry"),
      url("pr2", "https://canvasonline.com/soft-impact-group-show-with-hayaty-diaries-at-greatorex/"),
      // FAD's critic is Tabish Khan, not "Tobish".
      url("pr3", "https://fadmagazine.com/2025/08/01/the-top-5-art-exhibitions-to-see-in-london-in-august/"),
      field("pr3", "title", 'Tabish Khan, "The Top 5 Art Exhibitions to See in London in August"'),
      url("pr5", "https://artplugged.co.uk/tiyana-mitchell-paints-film-of-memory/"),
      // Same RCA roundup as Chiedu Okonta's pr2 — one article, both artists.
      url("pr6", "https://www.blowoutmagazine.com/blowout-art/2025/6/30/rca-degree-show-2025-highlights"),
      url("pr7", "https://www.tiderip.co.uk/news/faded-curator-reflection"),
      url("pr8", "https://www.tiderip.co.uk/news/faded-tiyanamitchell"),
      url("pr11", "https://parsons.edu/undergrad/student-work/tiyana-mitchell/"),
    ]),
  },
];

let fieldCount = 0;
for (const { id, label, set } of patches) {
  const result = await client.patch(id).set(set).commit();
  const n = Object.keys(set).length;
  fieldCount += n;
  console.log(`${label}: ${n} field(s) set (${result.press.length} press entries)`);
}

// londonpaintclub.com no longer belongs to the gallery — the domain now serves an
// unrelated gambling site, so this credit can never be safely linked.
const mm = await client
  .patch("artist-mengmeng-zhang")
  .unset(['press[_key=="pr1"]'])
  .commit();
console.log(`Mengmeng Zhang: removed London Paint Club entry (${mm.press.length} press entries remain)`);

console.log(`\nDone: ${fieldCount} fields set across ${patches.length} artists, 1 entry removed.`);
