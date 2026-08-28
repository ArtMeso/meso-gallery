// Adds the remaining Osman Yousefzada coverage, now that publish dates have
// been established from each page's own metadata (article:published_time /
// datePublished / on-page date) rather than inferred.
//
// Excluded: Vogue Middle East — en.vogue.me now 301s to the Vogue Arabia
// homepage and the equivalent voguearabia.com path 404s, so the article no
// longer exists anywhere live.
//
// Included with a caveat: the WSJ piece returns 401 to logged-out visitors.
// It is a real, live article behind a paywall (same situation as the existing
// FT entry), so it stays — the date comes from the Unix timestamp WSJ appends
// to its own slug (1492627046 = 2017-04-19).
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

const entries = [
  ["oy-wallpaper", "“Osman Yousefzada wraps Selfridges in world’s largest canvas”", "Wallpaper*", "2021-07-27", "https://www.wallpaper.com/art/osman-yousefzada-infinity-pattern-1-selfridges-birmingham-installation"],
  ["oy-arabnews", "“Afghan-Pakistani designer Osman Yousefzada unveils world’s largest canvas at UK store”", "Arab News", "2021-07-29", "https://www.arabnews.com/node/1902051/lifestyle"],
  ["oy-vogueuk", "“Osman Yousefzada Launches A New Exhibition On The Experience Of Migration”", "Vogue UK", "2018-06-07", "https://www.vogue.co.uk/article/osman-yousefzada-ikon-gallery-being-somewhere-else"],
  ["oy-r29", "“Designer Osman Explores His Mother’s Oppression In New Exhibit”", "Refinery29", "2018-06-15", "https://www.refinery29.com/en-us/osman-yousefzada-ikon-migrant-festival-birmingham"],
  ["oy-observer", "“With His Fashion Line and Now His Art, Osman Yousefzada Pays Tribute to His Mom”", "Observer", "2018-07-26", "https://observer.com/2018/07/osman-yousefzada-on-the-inspiration-behind-his-fashion-and-art-his-mom/"],
  ["oy-showstudio", "Hetty Mahlich, “Osman Yousefzada On Changing the Fashion System”", "SHOWstudio", "2021-12-24", "https://www.showstudio.com/news/osman-yousefzada-on-changing-the-fashion-system"],
  ["oy-tvof", "“Osman Yousefzada on South Asian Design, European Faces and Brown Hands”", "The Voice of Fashion", "2020-09-28", "https://thevoiceoffashion.com/centrestage/profiles/osman-yousefzada-on-south-asian-design-european-faces-and-brown-hands-4044"],
  ["oy-bof", "Tamison O’Connor, “Osman Yousefzada Debuts Solo Exhibition”", "The Business of Fashion", "2018-06-04", "https://www.businessoffashion.com/articles/news-analysis/osman-yousefzada-debuts-solo-exhibition-being-somwhere-else-ikon-birmingham/"],
  ["oy-wsj", "“Barneys New York Sets An Art-Filled Scene”", "The Wall Street Journal", "2017-04-19", "https://www.wsj.com/articles/barneys-new-york-sets-an-art-filled-scene-1492627046"],
  ["oy-lux", "“Confined Artists — Free Spirits: Photographs from Lockdown”", "LUX Magazine", "2020-04-16", "https://www.lux-mag.com/confined-artists-free-spirits-2020/"],
  ["oy-plinth", "“Osman Yousefzada, Being Somewhere Else at Ikon Gallery”", "Plinth", "2018-06-25", "https://plinth.uk.com/blogs/in-the-studio-with/osman-yousefzada-being-somewhere-else-at-ikon-gallery"],
].map(([_key, title, publication, date, url]) => ({
  _key,
  _type: "pressEntry",
  title,
  publication,
  date,
  url,
}));

const current = await client.fetch(`*[_id == "artist-osman-yousefzada"][0]{press}`);
const have = new Set((current.press || []).map((p) => p.url).filter(Boolean));
const fresh = entries.filter((x) => !have.has(x.url));

if (fresh.length === 0) {
  console.log("Nothing new to add.");
} else {
  const r = await client
    .patch("artist-osman-yousefzada")
    .append("press", fresh)
    .commit();
  console.log(`Osman Yousefzada: +${fresh.length} -> ${r.press.length} entries, ${r.press.filter((p) => p.url).length} linked`);
}
