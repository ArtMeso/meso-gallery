# MeSo Ventures

Next.js 14 (App Router) site for MeSo Ventures — an international contemporary
art gallery and advisory platform based in London and Dubai.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Sanity.io** (project `jncu3emy`, dataset `production`) for Artists, Articles
  (MeSo Mag) and Exhibitions — embedded Studio at `/studio`
- **Google Sheets** as the live artworks catalogue, fetched as TSV
- **Vercel** for deployment

## Getting started

```bash
npm install
cp .env.local.example .env.local   # already prefilled with the Sanity project id/dataset
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Editing content

- **Artists, MeSo Mag articles, Exhibitions** — go to `/studio` (Sanity Studio,
  embedded in the app) and sign in with a Sanity account that has access to
  project `jncu3emy`. First run will prompt you to add the current URL
  (`http://localhost:3000`, and later your production domain) as a CORS
  origin at manage.sanity.io → project `jncu3emy` → API → CORS origins —
  that's expected, just click through and add it once.
- **Artworks catalogue** — edit the Google Sheet directly. The site polls it
  live (revalidates every ~2 minutes), no redeploy needed. Required columns:
  `Title, Artist, Medium, Medium Full, Based in, Type, Size, Dims, Year, Price,
  Currency, Bio, Image Url`. Leave `Price` blank for "Pricing on request".
  - **Image Url** just needs to be any public direct image link — the site
    renders it with a plain `<img>` tag, not tied to any particular host.
    Artwork photos are hosted on **Cloudinary** (free tier): upload images
    in bulk via the Cloudinary Media Library, copy each image's direct URL,
    and paste it into the matching row's `Image Url` column. No code
    changes or redeploy needed either way.

### Managing the artist roster

The gallery currently represents 12 artists, all fully seeded in Sanity via
`scripts/seed-artists.mjs` — portraits, bios, practice statements, education,
exhibitions, and (where the source material had it) collections, awards,
teaching/experience and press.

To add a new artist or update an existing one:

1. Create a write token at [manage.sanity.io](https://manage.sanity.io) → your
   project → API → Tokens (Editor role), and set it as `SANITY_API_TOKEN` in
   `.env.local` (the script reads it from there automatically — no need to
   pass it inline).
2. Add a folder under `scripts/artist-data/<slug>/` (slug = lowercase,
   hyphenated name, e.g. `jessie-makinson`) containing the artist's CV/bio as
   a `.docx` and one or more portrait photos (`.jpg`/`.jpeg`/`.png`/`.webp`).
   If more than one photo is present, the script uploads all of them, keeps
   whichever has the highest actual pixel resolution, and deletes the rest.
3. Transcribe the CV into the `artists` array (basic fields) and `richData`
   object (education/exhibitions/etc., keyed by slug) in
   `scripts/seed-artists.mjs`.
4. Run:
   ```bash
   npm run seed:artists
   ```

Safe to re-run — each artist is `createOrReplace`'d against a deterministic
`_id` (`artist-<slug>`), so re-running just updates the same 12 documents
rather than duplicating them. Note this writes straight to the *published*
document, not a draft — if you've been editing that artist manually in
`/studio`, discard the draft there afterwards so it doesn't diverge from
what's published.

## Environment variables

See `.env.local.example`. In short:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | `jncu3emy` |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | `2025-01-01` |
| `SANITY_API_TOKEN` | Only for seeding/drafts | Create at manage.sanity.io |
| `NEXT_PUBLIC_ARTWORKS_SHEET_URL` | Has a working fallback | TSV export URL of the artworks sheet |

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket) and import it in Vercel.
2. Add the environment variables above in the Vercel project settings
   (Production + Preview).
3. Deploy — `next build` / `next start` need no special config.
4. Once live, update `NEXT_PUBLIC_ARTWORKS_SHEET_URL` if the sheet URL/gid ever
   changes, and add the real WhatsApp number in `src/lib/site-config.ts`
   (`whatsapp` field — currently a placeholder).

### Known follow-ups

- `src/lib/site-config.ts` — `whatsapp` is a placeholder (`971XXXXXXXXX`);
  replace with the real number.
- `/about` — the Team section is a placeholder; add real founder/team
  bios and photos.
- The contact form and all "Enquire" buttons currently open a pre-filled
  `mailto:` to `art@mesoventures.com` (no backend needed). If you'd rather
  have submissions delivered server-side instead of relying on the visitor's
  email client, that needs an email API (e.g. Resend/SendGrid) wired into a
  Next.js API route.

## Local dev note (Windows)

`npm run dev` runs with `NODE_OPTIONS=--use-system-ca`. Some local Windows
setups (corporate proxies/antivirus doing TLS inspection) fail to verify the
certificate chain for outbound fetches (Google Fonts, Sanity, Google Sheets)
without this flag. It's not needed on Vercel.
