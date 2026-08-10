// One-time import of magazine articles from the old Squarespace site's
// WordPress-format export (Settings → Advanced → Import/Export → Export).
//
// Usage:
//   npm run seed:articles -- "C:\path\to\export.xml"
//
// Downloads each article's featured image and inline images from the old
// Squarespace CDN and re-uploads them to Sanity (so nothing depends on
// Squarespace staying online), converts the body HTML into Portable Text,
// and writes each article via createOrReplace against a deterministic
// _id — safe to re-run.

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

const exportPath = process.argv[2];
const onlySlug = process.argv[3]; // optional: test/re-run a single article by slug
if (!exportPath) {
  console.error('Usage: npm run seed:articles -- "C:\\path\\to\\export.xml" [only-this-slug]');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jncu3emy",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// ---- old -> new site mapping (kept in sync with next.config.mjs) --------
const OLD_ARTIST_SLUGS = new Set([
  "jessie-makinson",
  "parnika-mittal",
  "tiyana-mitchell",
  "mary-pye",
  "osman-yousefzada",
  "kubra-aliyeva",
  "tallulah-hutson",
  "lydia-hamblet",
  "mengmeng-zhang",
  "joya-mukerjee-logue",
  "chiedu-okonta",
]);

const CATEGORY_MAP = {
  "Charity Ball": "Events",
  Events: "Events",
  "Art Fairs": "Art Fair",
  Exhibitions: "Exhibition Review",
  "Artist Interviews": "Artist Spotlight",
  "Art Curation": "Press Release",
};

const CATEGORY_BY_SLUG_FALLBACK = {
  "art-as-an-investment-2026-guide-for-collectors": "Market Intelligence",
  "how-to-start-an-art-collection": "Collecting Guide",
};

// Known artist slugs, for auto-linking relatedArtists by name match in title.
const ARTIST_NAME_TO_SLUG = {
  "Jessie Makinson": "jessie-makinson",
  "Parnika Mittal": "parnika-mittal",
  "Tiyana Mitchell": "tiyana-mitchell",
  "Mary Pye": "mary-pye",
  "Osman Yousefzada": "osman-yousefzada",
  "Kubra Aliyeva": "kubra-aliyeva",
  "Tallulah Hutson": "tallulah-hutson",
  "Lydia Hamblet": "lydia-hamblet",
  "Mengmeng Zhang": "mengmeng-zhang",
  "Joya Mukerjee Logue": "joya-mukerjee-logue",
  "Chiedu Okonta": "chiedu-okonta",
  // Mohini Kaur intentionally omitted — her artist document was removed,
  // so a reference to it would fail Sanity's reference-integrity check.
};

// ---- entity decoding ------------------------------------------------------
const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "\u2019",
  lsquo: "\u2018",
  rdquo: "\u201d",
  ldquo: "\u201c",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
};

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(\w+);/g, (m, name) => NAMED_ENTITIES[name] ?? m);
}

function stripTags(str) {
  return decodeEntities(str.replace(/<[^>]+>/g, "")).trim();
}

// ---- inline HTML -> Portable Text spans + markDefs -----------------------
let keyCounter = 0;
const nextKey = (prefix) => `${prefix}${keyCounter++}`;

function normalizeHref(href) {
  if (!href) return href;
  const clean = href.trim();
  const bareSlug = clean.startsWith("/") ? clean.slice(1) : null;
  if (bareSlug && OLD_ARTIST_SLUGS.has(bareSlug)) return `/artists/${bareSlug}`;
  return clean;
}

function parseInline(html) {
  const cleaned = html.replace(/<br\s*\/?>/gi, " ");
  const tokenRe = /<(\/)?(\w+)([^>]*)>|([^<]+)/g;
  const children = [];
  const markDefs = [];
  const stack = [];
  let m;
  while ((m = tokenRe.exec(cleaned))) {
    const [, closing, tag, attrs, plain] = m;
    if (plain !== undefined) {
      const text = decodeEntities(plain);
      if (text) {
        children.push({
          _type: "span",
          _key: nextKey("sp"),
          text,
          marks: stack.map((s) => s.mark).filter(Boolean),
        });
      }
      continue;
    }
    const tag2 = tag.toLowerCase();
    if (closing) {
      const idx = [...stack].reverse().findIndex((s) => s.tag === tag2);
      if (idx !== -1) stack.splice(stack.length - 1 - idx, 1);
      continue;
    }
    if (tag2 === "strong" || tag2 === "b") {
      stack.push({ tag: tag2, mark: "strong" });
    } else if (tag2 === "em" || tag2 === "i") {
      stack.push({ tag: tag2, mark: "em" });
    } else if (tag2 === "u") {
      stack.push({ tag: tag2, mark: null }); // no underline decorator in schema
    } else if (tag2 === "a") {
      const hrefMatch = attrs.match(/href="([^"]*)"/);
      const href = normalizeHref(hrefMatch ? hrefMatch[1] : "#");
      const key = nextKey("link");
      markDefs.push({ _type: "link", _key: key, href });
      stack.push({ tag: "a", mark: key });
    }
    // self-closing/void tags not otherwise handled are ignored
  }
  return { children, markDefs };
}

function makeBlock(innerHtml, style) {
  const { children, markDefs } = parseInline(innerHtml);
  if (children.length === 0) return null;
  return {
    _type: "block",
    _key: nextKey("blk"),
    style,
    markDefs,
    children,
  };
}

// ---- body HTML -> Portable Text array (with image blocks) ----------------
function parseHtmlChunk(html) {
  const blocks = [];
  const elRe = /<(p|h2|h3|ul)[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = elRe.exec(html))) {
    const [, tag, inner] = m;
    if (tag === "ul") {
      const liRe = /<li[^>]*>([\s\S]*?)<\/li>/g;
      let li;
      while ((li = liRe.exec(inner))) {
        const block = makeBlock(li[1], "normal");
        if (block) {
          block.listItem = "bullet";
          block.level = 1;
          blocks.push(block);
        }
      }
    } else {
      const style = tag === "p" ? "normal" : tag;
      const block = makeBlock(inner, style);
      if (block) blocks.push(block);
    }
  }
  return blocks;
}

function parseCaption(content) {
  const srcMatch = content.match(/<img[^>]*src="([^"]*)"/);
  const altMatch = content.match(/alt="([^"]*)"/);
  const afterImg = content.replace(/<img[^>]*\/?>/, "");
  return {
    src: srcMatch ? srcMatch[1].trim() : null,
    alt: altMatch ? decodeEntities(altMatch[1]).trim() : "",
    caption: stripTags(afterImg),
  };
}

async function bodyHtmlToBlocks(html, uploadImage) {
  const tokens = [];
  const divRe = /<div class="sqs-html-content"[^>]*>([\s\S]*?)<\/div>/g;
  const capRe = /\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g;
  let m;
  while ((m = divRe.exec(html))) tokens.push({ type: "html", index: m.index, content: m[1] });
  while ((m = capRe.exec(html))) tokens.push({ type: "caption", index: m.index, content: m[1] });
  tokens.sort((a, b) => a.index - b.index);

  const blocks = [];
  for (const token of tokens) {
    if (token.type === "html") {
      blocks.push(...parseHtmlChunk(token.content));
    } else {
      const { src, alt, caption } = parseCaption(token.content);
      if (!src) continue;
      const asset = await uploadImage(src);
      if (!asset) continue;
      blocks.push({
        _type: "image",
        _key: nextKey("img"),
        asset: { _type: "reference", _ref: asset._id },
        alt: alt || caption || "",
        caption: caption || undefined,
      });
    }
  }
  return blocks;
}

// ---- image upload (dedup by source URL so repeats aren't re-uploaded) ----
const uploadedByUrl = new Map();

async function uploadImageFromUrl(url) {
  if (!url) return null;
  if (uploadedByUrl.has(url)) return uploadedByUrl.get(url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = decodeURIComponent(url.split("/").pop().split("?")[0]) || "image.jpg";
    const asset = await client.assets.upload("image", buffer, { filename });
    uploadedByUrl.set(url, asset);
    return asset;
  } catch (err) {
    console.warn(`  ! failed to upload image ${url}: ${err.message}`);
    return null;
  }
}

// ---- excerpt ---------------------------------------------------------------
function plainTextFromBlocks(blocks) {
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => b.children.map((c) => c.text).join(""))
    .join(" ")
    .trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "\u2026";
}

// ---- WXR parsing ------------------------------------------------------------
function parseExport(xmlPath) {
  const xml = fs.readFileSync(xmlPath, "utf8");
  const items = xml
    .split("<item>")
    .slice(1)
    .map((s) => "<item>" + s.split("</item>")[0] + "</item>");

  const attachmentsById = new Map();
  for (const item of items) {
    if (!/<wp:post_type>attachment<\/wp:post_type>/.test(item)) continue;
    const id = (item.match(/<wp:post_id>(\d+)<\/wp:post_id>/) || [])[1];
    const url = (item.match(/<wp:attachment_url>(.*?)<\/wp:attachment_url>/) || [])[1];
    if (id && url) attachmentsById.set(id, url);
  }

  const posts = items.filter(
    (i) => /<wp:post_type>post<\/wp:post_type>/.test(i) && /<link>\/magazine\//.test(i)
  );

  return posts.map((item) => {
    const title = decodeEntities((item.match(/<title>(.*?)<\/title>/) || [])[1] || "");
    const slug = (item.match(/<wp:post_name>(.*?)<\/wp:post_name>/) || [])[1];
    const pubDate = (item.match(/<wp:post_date>(.*?)<\/wp:post_date>/) || [])[1];
    const oldCategory = (
      item.match(/<category domain="category"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/) || []
    )[1];
    const thumbId = (
      item.match(/_thumbnail_id<\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]>/) || []
    )[1];
    const content = (
      item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) || []
    )[1] || "";

    const category =
      CATEGORY_MAP[oldCategory] || CATEGORY_BY_SLUG_FALLBACK[slug] || "Market Intelligence";
    const featuredImageUrl = thumbId ? attachmentsById.get(thumbId) : undefined;

    return { title, slug, pubDate, category, content, featuredImageUrl };
  });
}

// ---- main ------------------------------------------------------------------
const run = async () => {
  let articles = parseExport(exportPath);
  if (onlySlug) articles = articles.filter((a) => a.slug === onlySlug);
  console.log(`Found ${articles.length} magazine articles in export.\n`);

  for (const article of articles) {
    console.log(`Importing: ${article.title}`);

    const body = await bodyHtmlToBlocks(article.content, uploadImageFromUrl);
    const excerpt = truncate(plainTextFromBlocks(body), 240);

    let featuredImage;
    if (article.featuredImageUrl) {
      const asset = await uploadImageFromUrl(article.featuredImageUrl);
      if (asset) {
        featuredImage = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      }
    }

    const relatedSlug = Object.entries(ARTIST_NAME_TO_SLUG).find(([name]) =>
      article.title.includes(name)
    )?.[1];

    const doc = {
      _id: `article-${article.slug}`,
      _type: "article",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      author: "Eirini Meze",
      date: article.pubDate ? new Date(article.pubDate.replace(" ", "T") + "Z").toISOString() : undefined,
      category: article.category,
      excerpt: excerpt || undefined,
      body,
      ...(featuredImage ? { featuredImage } : {}),
      ...(relatedSlug
        ? {
            relatedArtists: [
              { _type: "reference", _key: "ra0", _ref: `artist-${relatedSlug}` },
            ],
          }
        : {}),
    };

    if (!doc.featuredImage) {
      console.warn(`  ! no featured image resolved for "${article.title}" — schema requires one, skipping create.`);
      continue;
    }

    await client.createOrReplace(doc);
    console.log(`  -> saved as article-${article.slug} [${article.category}]${relatedSlug ? ` [+ related: ${relatedSlug}]` : ""}\n`);
  }

  console.log("Done.");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
