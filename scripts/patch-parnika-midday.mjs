import { createClient } from "@sanity/client";
import fs from "node:fs";

if (!process.env.SANITY_API_TOKEN) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^SANITY_API_TOKEN=(.+)$/);
    if (m) process.env.SANITY_API_TOKEN = m[1].trim();
  }
}

const client = createClient({
  projectId: "jncu3emy",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const result = await client
  .patch("artist-parnika-mittal")
  .append("press", [{
    _key: "pr-midday-2026",
    _type: "pressEntry",
    title: "Immerse in this exhibition in Mumbai to explore the diversity of surrealism",
    publication: "Mid-Day",
    date: "2026-01-01",
    url: "https://www.mid-day.com/mumbai-guide/things-to-do/article/immerse-in-this-exhibition-in-mumbai-to-explore-the-diversity-of-surrealism-23631430",
  }])
  .commit();
console.log("Patched Parnika Mittal:", result._id, "— press entries:", result.press.length);
