// One-off patch:
// 1. Fixes Mary Pye's Mid-Day press entry (pr0), which was missing its `url`
//    field and so rendered as plain, unlinked text on the artist page.
// 2. Adds the new Hospemag "Artists-in-Residence Programme at Abode Bombay &
//    Abode Jaipur" (Aug 24, 2026) coverage to both Mary Pye and Parnika Mittal.
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

const hospemagEntry = (key) => ({
  _key: key,
  _type: "pressEntry",
  title: "Artists-in-Residence Programme at Abode Bombay & Abode Jaipur",
  publication: "Hospemag",
  date: "2026-08-24",
  url: "https://www.hospemag.me/cms/artists-in-residence-programme-at-abode-bombay-amp-abode-jaipur",
});

// 1. Fix Mary Pye's Mid-Day entry (add missing url) and append Hospemag entry.
const maryResult = await client
  .patch("artist-mary-pye")
  .set({ "press[_key==\"pr0\"].url": "https://www.mid-day.com/mumbai-guide/things-to-do/article/immerse-in-this-exhibition-in-mumbai-to-explore-the-diversity-of-surrealism-23631430" })
  .append("press", [hospemagEntry("pr-hospemag-2026")])
  .commit();
console.log("Patched Mary Pye:", maryResult._id, "— press entries:", maryResult.press.length);

// 2. Parnika Mittal has no press array yet — set it.
const parnikaResult = await client
  .patch("artist-parnika-mittal")
  .setIfMissing({ press: [] })
  .append("press", [hospemagEntry("pr-hospemag-2026")])
  .commit();
console.log("Patched Parnika Mittal:", parnikaResult._id, "— press entries:", parnikaResult.press.length);
