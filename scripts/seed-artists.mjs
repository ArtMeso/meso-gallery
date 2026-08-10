// One-time/idempotent seed script for the 14 represented artists.
//
// Usage:
//   SANITY_API_TOKEN=sk... npm run seed:artists
//
// Requires a Sanity API token with write access to project jncu3emy /
// dataset production. Create one at https://manage.sanity.io (Editor role
// is enough). Safe to re-run: each artist is createOrReplace'd against a
// deterministic _id, so re-running just overwrites the same 14 documents
// rather than duplicating them.
//
// This writes straight to the PUBLISHED document (_id: "artist-<slug>"),
// not the "drafts.artist-<slug>" doc — so any unpublished manual edits made
// in Studio are untouched by this script, but will diverge from what's
// published until you discard the draft or merge the two by hand.
//
// Rich fields (education/exhibitions/collections/awards/press) and a
// portrait are only set for artists that have a source file in
// scripts/artist-data/<slug>/ (one document + one image per folder — see
// readArtistFolder below). Everyone else keeps the same bio-only seed as
// before; missing fields are simply omitted from the document rather than
// written as empty/placeholder values, since every field but name/slug is
// optional in the schema and the site only renders sections that have data.

import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIST_DATA_DIR = path.join(__dirname, "artist-data");

// Plain Node scripts don't get Next.js's automatic .env.local loading, so
// fall back to reading it directly when SANITY_API_TOKEN isn't already set.
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
  console.error(
    "Missing SANITY_API_TOKEN. Create a write token at manage.sanity.io (project jncu3emy) and re-run:\n" +
      "  SANITY_API_TOKEN=sk... npm run seed:artists"
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jncu3emy",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function bioBlock(text) {
  return [
    {
      _type: "block",
      _key: "bio1",
      style: "normal",
      children: [{ _type: "span", _key: "bio1span", text }],
    },
  ];
}

// Finds image file(s) in scripts/artist-data/<slug>/ (any filename) and
// uploads the portrait as a Sanity image asset. If more than one image is
// present, all are uploaded, the highest-resolution one (by pixel count,
// via Sanity's own metadata) is kept, and the rest are deleted again.
// Returns an image field value, or undefined if the artist has no folder /
// no image in it.
async function uploadPortrait(slug) {
  const dir = path.join(ARTIST_DATA_DIR, slug);
  if (!fs.existsSync(dir)) return undefined;

  const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp"]);
  const files = fs
    .readdirSync(dir)
    .filter((f) => imageExts.has(path.extname(f).toLowerCase()));
  if (files.length === 0) return undefined;

  const uploaded = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
      filename: file,
    });
    uploaded.push({ file, asset });
  }

  uploaded.sort((a, b) => {
    const pxA =
      (a.asset.metadata?.dimensions?.width || 0) * (a.asset.metadata?.dimensions?.height || 0);
    const pxB =
      (b.asset.metadata?.dimensions?.width || 0) * (b.asset.metadata?.dimensions?.height || 0);
    return pxB - pxA;
  });
  const [best, ...rest] = uploaded;

  if (rest.length > 0) {
    const dims = (u) =>
      `${u.asset.metadata?.dimensions?.width}x${u.asset.metadata?.dimensions?.height}`;
    console.log(
      `  → ${files.length} portrait candidates for ${slug}, chose "${best.file}" (${dims(
        best
      )}) over ${rest.map((u) => `"${u.file}" (${dims(u)})`).join(", ")}`
    );
    await Promise.all(rest.map((u) => client.delete(u.asset._id).catch(() => {})));
  }

  return { _type: "image", asset: { _type: "reference", _ref: best.asset._id } };
}

const TODO_BIO =
  "TODO: replace with this artist's full biography. Placeholder seeded so the site and templates are fully wired ahead of real content.";

const artists = [
  {
    name: "Jessie Makinson",
    location: "London",
    discipline: "Painting",
    bio: "Jessie Makinson (b. 1985, based in London) creates intricate, jewel-like paintings that blend historical and folkloric environments with fantastical social portraiture. Her scenes draw on literary and mythological networks, folding together references such as 18th-century brothel imagery, Georgian parlour games, and contemporary eco sci-fi into unstable, funhouse-mirror worlds.",
    featured: true,
  },
  {
    name: "Parnika Mittal",
    location: "Delhi / London",
    discipline: "Painting",
    bio: "Parnika Mittal (b. 1993, based in Delhi/London) creates vivid, emotionally charged paintings shaped by colour, memory and fractured composition. Her practice explores selfhood, displacement and movement through forms that dissolve into abstraction, where recognisable figures and spaces give way to shifting patterns, textures and traces of feeling. Drawing on personal journals, lived transitions and the instability of home, her work holds memory, loss and identity in states of continual transformation.",
  },
  {
    name: "Tiyana Mitchell",
    location: "London",
    discipline: "Painting",
    bio: "Tiyana Mitchell (b. 2001; Scottsdale, Arizona) is an American–Jordanian artist based in London. Her paintings draw from photographic archives and family histories, using cropping and partial concealment to explore memory, identity, belonging, and the allure of the image.",
  },
  {
    name: "Mary Pye",
    location: "London",
    discipline: "Painting",
    bio: "Mary Pye (b. 2001; Manchester, UK) is a painter whose meditative, layered works are shaped by stillness and sustained attention. Working through a slow rhythm of deposition and erosion, she builds surfaces through repeated gestures — laying down pigment, shifting it, withdrawing it, and allowing it to settle over time. Each painting becomes a form of quiet listening: to what arrives, what lingers, and what chooses to remain unseen.",
  },
  {
    name: "Osman Yousefzada",
    location: "London",
    discipline: "Textile & Installation",
    bio: "Osman Yousefzada (b. 1977, Birmingham, UK) is a British interdisciplinary artist and writer, born to first-generation migrants from South Asia. Working across installation, sculpture, textile, moving image and performance, his practice is auto-ethnographic in nature. Osman Yousefzada transforms personal memory and migrant experience into urgent, politically charged visual language. His work is held in major international collections and has been exhibited at the V&A, the Venice Biennale, and the Whitechapel Gallery, among others.",
  },
  {
    name: "Kubra Aliyeva",
    location: "London / Baku",
    discipline: "Installation & Sculpture",
    bio: "Kubra Aliyeva (b. 1989; Baku, Azerbaijan) is an Azerbaijani artist based in London, currently studying at the Royal College of Art. Working across installation, sculpture, painting, and printmaking, her practice explores the female body as a site of memory and labour through tactile processes of repetition, layering, and repair.",
  },
  {
    name: "Tallulah Hutson",
    location: "London",
    discipline: "Painting",
    bio: "Tallulah Hutson (b. 1996; London, UK) is a London-based figurative painter whose practice moves between portraiture and the body in motion. Painting in oil, she centres moments of heightened feeling — figures caught dancing, leaning, or turning inward — and uses gesture as a way to hold the tension between intimacy and the wider social and political world.",
  },
  {
    name: "Lydia Hamblet",
    location: "London",
    discipline: "Painting & Printmaking",
    bio: "Lydia Hamblet (b. 1995, Kent; based in London) is an artist working across painting, print, and public installation, and a graduate of the Royal College of Art. Her practice is rooted in the observation of landscape, weather, movement and the traces left by human activity in the environment — from municipal sports pitches to urban waterways. Hamblet's work invites viewers to connect their own memories and feelings to the weather imprints, light and energy encoded in her surfaces.",
  },
  {
    name: "Mengmeng Zhang",
    location: "London / China",
    discipline: "Painting",
    bio: "Mengmeng Zhang (b. 1997, Jiangsu, China; based in London) is a painter whose intuitive practice spans acrylic, gouache, ink and pastel to explore memory, displacement and fragmented realities. Working at the intersection of psychogeography and phenomenology, Zhang creates layered compositions that trace the displacement between memory and the present — between inner emotion and outer environment. Her stylised characters and intuitive colour choices embody moods, actions and fictional experiences drawn from personal reflections on everyday life.",
  },
  {
    name: "Joya Mukerjee Logue",
    location: "Cincinnati",
    discipline: "Painting",
    bio: "Joya Mukerjee Logue (b. 1976, Springfield, Ohio; based in Cincinnati, USA) is an American painter of Indian heritage whose work explores the atmosphere of human connection. Working primarily in oil and watercolour, she composes intimate scenes of gatherings, glances and social thresholds, rendered in a luminous palette that heightens mood over narrative. Her practice extends the atmospheric modernism of painters such as Helene Schjerfbeck, James McNeill Whistler and Gaganendranath Tagore, finding contemporary kinship with Katherine Bradford and Matthew Krishanu.",
  },
  {
    name: "Chiedu Okonta",
    location: "London / Nigeria",
    discipline: "Painting, Sculpture & Digital Art",
    bio: "Chiedu Okonta (b. 1979, Nigeria; based in London) is a Nigerian-British multidisciplinary artist with a socially engaged practice spanning painting, sculpture, digital art and installation. A recipient of the Sir Frank Bowling Scholarship, he graduated from the MA Painting programme at the Royal College of Art in 2025. His practice integrates self-taught foundations with formal education, functioning as a tool to address systemic inequalities, combat unethical industrial practices, and bear witness to ecological and human rights crises — particularly those affecting the Niger Delta region of Nigeria.",
  },
  {
    name: "Conor Murgatroyd",
    location: "London",
    discipline: "Painting",
    bio: "Conor Murgatroyd (b. 1995, Bradford, West Yorkshire). He received his BA Fine Art from Chelsea College of Art in 2016 and was awarded the Knights of The Round Table award shortly after. His works are manifestations of his inner landscape, deeply rooted in his past, familial heritage, and cultural influences. Through his visual language, he seeks to give form to his subconscious and thoughts, creating a dialogue with the \"soul\" of his past and present. The poetic worlds that he creates are a direct response to the intellectual fusion of images, personal and external. His paintings act as a stage which brings together the myriad of characters and objects he has come into contact with; both imaged and lived. In Murgatroyd's work he draws attention, not to the external reality as such, but rather to the unfathomable mystery behind this.",
  },
];

// Rich data (education/exhibitions/collections/awards/press) sourced from
// each artist's CV in scripts/artist-data/<slug>/. Only populated for
// artists whose files have been supplied and transcribed so far — add an
// entry here (keyed by slug) as more come in.
const richData = {
  "jessie-makinson": {
    practice:
      "Jessie Makinson creates richly imagined ecofeminist worlds in which human and non-human life exist in a constant state of renegotiation. Combining drawing and painting, she builds scenes charged with tension, humour and desire, populated by objects that seem to abandon their function and figures that feel at once mysterious, theatrical and strangely familiar. Drawing on references that range from contemporary science fiction and British folklore to 17th- and 18th-century erotica, pre-agricultural mythology, early Renaissance altarpieces and Flemish kitchen scenes, Jessie Makinson folds together diverse visual histories to create vivid, unstable narratives.\n\nHer paintings are marked by bold colour, erotic energy and a sense of ritual, where characters embrace, plot, perform and disrupt expectation. Plucking themes from British pop culture and mixing them with recognisable American motifs, Makinson creates charged new contexts in which power is fluid and desire is active rather than passive. The result is a universe that is sensuous, mischievous and psychologically complex, inviting viewers into scenes that surprise, delight and unsettle in equal measure.",
    education: [
      "2016 — Turps Banana Studio Program, London, UK",
      "2013 — The Drawing Year Postgraduate Program, The Royal Drawing School, London, UK",
      "2007 — Drawing and Painting, Edinburgh College of Art, Edinburgh, UK",
      "2004 — Foundation, Camberwell College of Art, London, UK",
    ],
    exhibitions: [
      { year: "2025", title: "Jessie Makinson", venue: "Brigitte Mulholland, Paris, France", type: "Solo" },
      { year: "2024", title: "Sting to Your Bow", venue: "SPURS Gallery, Beijing, China", type: "Solo" },
      { year: "2023", title: "Bad Sleeper", venue: "Lyles & King, New York, USA", type: "Solo" },
      { year: "2023", title: "Hoof on Bone", venue: "François Ghebaly, Los Angeles, USA", type: "Solo" },
      { year: "2021", title: "Stay here while I get a curse", venue: "Lyles & King, New York, USA", type: "Solo" },
      { year: "2021", title: "Something Vexes Thee?", venue: "François Ghebaly, Los Angeles, USA", type: "Solo" },
      { year: "2020", title: "Dangerous Pleasing", venue: "Lyles and King, New York, USA", type: "Solo" },
      { year: "2019", title: "Nobody Axed You To", venue: "Fabian Lang, Zurich, Switzerland", type: "Solo" },
      { year: "2019", title: "Tender Trick", venue: "Galería OMR, Mexico City, Mexico", type: "Solo" },
      { year: "2018", title: "Jessie Makinson & Stuart Lorimer", venue: "Lyles & King, New York, USA", type: "Solo" },
      { year: "2015", title: "Fancy", venue: "9b Projects, London, UK", type: "Solo" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures, The HiLight, London, UK", type: "Group" },
      { year: "2026", title: "The Mythologies of Colour", venue: "MeSo Ventures, Soho House Mumbai, Mumbai, India", type: "Group" },
      { year: "2024", title: "Oddkin: Beast, Body, Biome", venue: "Cob Gallery, London, UK", type: "Group" },
      { year: "2024", title: "Viscous", venue: "Cassina Projects, Milan, IT", type: "Group" },
      { year: "2024", title: "Leonora Carrington: Avatars & Alliances", venue: "Firstsite, Essex, UK", type: "Group" },
      { year: "2024", title: "10 Years Anniversary", venue: "Lychee One, London, UK", type: "Group" },
      { year: "2024", title: "Drawn together", venue: "Royal Drawing School, London, UK", type: "Group" },
      { year: "2023", title: "British Art Now", venue: "Telegraph Foundation, Olomouc, Czech Republic", type: "Group" },
      { year: "2023", title: "The Descendants", venue: "WOAW Gallery, Hong Kong, China", type: "Group" },
      { year: "2023", title: "MATERNITY LEAVE: NONE OF WOMEN BORN", venue: "Nidodim Gallery and the Green Family Art Foundation, Dallas, USA", type: "Group" },
      { year: "2022", title: "Machines of Desire", venue: "Simon Lee Gallery, London, UK & Hong Kong, China", type: "Group" },
      { year: "2022", title: "Drawing Attention: Emerging British Artists", venue: "British Museum, London, UK", type: "Group" },
      { year: "2022", title: "Bad Girls", venue: "curated by Joan Tucker, Maze Tower, Dubai, UAE", type: "Group" },
      { year: "2021", title: "Dancing in Dark Times", venue: "Pippy Houldsworth Gallery, London, UK", type: "Group" },
      { year: "2021", title: "My Secret Garden", venue: "Asia Art Center, Taipei, Taiwan", type: "Group" },
      { year: "2021", title: "Horses?", venue: "CHART Gallery, New York, NY, USA", type: "Group" },
      { year: "2021", title: "Hapticity: A Theory of Touch and Identity", venue: "Lychee One, London, UK", type: "Group" },
      { year: "2021", title: "Reigen", venue: "Fabian Lang, Zurich, Switzerland", type: "Group" },
      { year: "2020", title: "I WANT TO FEEL ALIVE AGAIN", venue: "Lyles & King, New York, USA", type: "Group" },
      { year: "2020", title: "Der abscheuliche kuss", venue: "curated by Marie-Charlotte Carrier, Kunstverein Dresden, Dresden, Germany", type: "Group" },
      { year: "2020", title: "I See You", venue: "Victoria Miro Gallery, London, UK", type: "Group" },
      { year: "2019", title: "The Self, the Work, the World", venue: "Fabian Lang, Zurich, Switzerland", type: "Group" },
      { year: "2019", title: "No Patience for Monuments", venue: "Perrotin, Seoul, South Korea", type: "Group" },
      { year: "2019", title: "Hyper Mesh", venue: "curated by Alive Bonnot, Assembly Point, London, UK", type: "Group" },
      { year: "2018", title: "In the Company Of", venue: "curated by Katy Hessel, T.J. Boulting, London, UK", type: "Group" },
      { year: "2018", title: "Year One", venue: "Frestonian Gallery, London, UK", type: "Group" },
      { year: "2018", title: "Dead Eden", venue: "Lyles & King, New York, USA", type: "Group" },
      { year: "2018", title: "BioPeversity", venue: "Nicodim Gallery, Los Angeles, USA", type: "Group" },
      { year: "2018", title: "Formal Encounters", venue: "Nicodim Gallery, Bucharest, Romania", type: "Group" },
      { year: "2018", title: "Breaking Shells", venue: "curated by Justine Do Espirito Santo, The Koppel Project, London, UK", type: "Group" },
      { year: "2018", title: "If you can't stand the heat", venue: "Roaming Projects, London, UK", type: "Group" },
      { year: "2017", title: "Poem of the pillow", venue: "curated by Kate Neave, Frameless Gallery, London, UK", type: "Group" },
      { year: "2017", title: "Figure it Out", venue: "Tannery Project Space, London, UK", type: "Group" },
      { year: "2017", title: "You see me like a UFO", venue: "Marcelle Joseph Projects, Ascot, UK", type: "Group" },
      { year: "2017", title: "Only a Handful", venue: "City and Guilds, London, UK", type: "Group" },
      { year: "2017", title: "The Luminous Language", venue: "Frestonian Gallery, London, UK", type: "Group" },
      { year: "2017", title: "Does your chewing gum lose it's flavour (on the bedpost overnight)", venue: "J Hammond Projects, London, UK", type: "Group" },
      { year: "2016", title: "The Classical", venue: "Transition Gallery, London, UK", type: "Group" },
      { year: "2016", title: "Fake French", venue: "Roman Road, London, UK", type: "Group" },
      { year: "2016", title: "Painting Made Me Do It", venue: "The Dot Project, London, UK", type: "Group" },
      { year: "2015", title: "Concrete Fictions", venue: "New Art Projects, London, UK", type: "Group" },
      { year: "2015", title: "Turps Goes West", venue: "Edel Assanti, London, UK", type: "Group" },
      { year: "2013", title: "Re-Enchanted Worlds", venue: "Bosse and Baum, London, UK", type: "Group" },
    ],
    collections: [
      "British Museum, London, UK",
      "Hessel Museum, New York, USA",
      "ICA Miami, Miami, USA",
      "Long Museum, Shanghai, China",
      "X Museum, Beijing, China",
    ],
    awards: [
      "2016 — Marmite Prize, London, UK",
      "2015 — Creekside Open, selected by Lisa Milroy, A.P.T. Gallery, London, UK",
      "2014 — Sir Dennis Mahon Award, London, UK",
    ],
    // Dates in the source CV are month/year precision in a few cases — day
    // is set to 01 as a placeholder where no exact day was given.
    press: [
      { title: 'Laster, Paul, "9 Standout Solo Gallery Shows to See in Paris"', publication: "Galerie", date: "2025-10-23" },
      { title: 'White, Katie, "Jessie Makinson’s Kaleidoscopic Paintings Are Brimming With Art Historical Footnotes"', publication: "Artnet", date: "2023-11-17" },
      { title: 'Olsen, Annikka, "Artists to Watch This Month: 10 Solo Gallery Exhibitions in New York to Have on Your Radar in November"', publication: "Artnet", date: "2023-11-09" },
      { title: '"Spotlighting 8 Emerging Artists In Celebration Of International Women’s Day"', publication: "Hypebae", date: "2023-03-08" },
      { title: '"Modern Mythology"', publication: "MUSE Magazine", date: "2023-01-06" },
      { title: '"Spotlight: A Two-Part Exhibition in London and Hong Kong Explores How Art Can Inject New Images Into the Collective Conscious"', publication: "Artnet News", date: "2022-07-25" },
      { title: 'Hingley, Olivia, "How Jessie Makinson’s carnivalesque paintings “purposely misunderstand historical imagery”"', publication: "It's Nice That", date: "2022-03-07" },
      { title: 'Fateman, Johanna, "Jessie Makinson / Phumelele Tshabalala"', publication: "The New Yorker", date: "2021-10-01" },
      { title: 'Dillon, Noah, "Jessie Makinson: Stay here while I get a curse"', publication: "The Guide Art", date: "2021-10-01" },
      { title: '"Interview: Painter Jessie Makinson On Temper Tantrums & Setting The Scene"', publication: "Something Curated", date: "2021-03-19" },
      { title: 'Ortiz Rapalo, Maria, "7 Contemporary Female Painters Breathing Fresh Life Into Surrealism"', publication: "Lawrence Van Hagen", date: "2021-01-01" },
      { title: '"Jessie Makinson’s Mythical Femininity in an Aberrant World"', publication: "Gestalten", date: "2020-09-01" },
      { title: 'Alleyne, Allyssia, "Jessie Mackinson’s Otherworldly Paintings Are Filled with Enigmatic Tales"', publication: "Artsy", date: "2020-08-24" },
      { title: 'Steer, Emily, "Lose Yourself in Jessie Makinson’s Fantastical, Impish Paintings"', publication: "Elephant Magazine", date: "2020-07-13" },
      { title: 'Sherwin, Skye, "Jessie Makinson’s Furry Darkness: a carnivalesque party"', publication: "The Guardian", date: "2020-06-05" },
      { title: 'Snoad, Lauren, "Jessie Makinson on the intuitive process behind her fantastical paintings"', publication: "It's Nice That", date: "2019-12-10" },
      { title: 'Cepeda, Gaby, "Jessie Makinson’s Fantastical Works Imagine a Posthuman Dreamworld"', publication: "Art In America", date: "2019-08-21" },
      { title: 'Delmage, Lara, "Jessie Makinson: Fake and Lies"', publication: "METAL", date: "2019-08-01" },
      { title: 'Zemtsova, Maria, "Subverting Patriarchal Myths: The Willfully Feminist Work of Jessie Makinson"', publication: "Art Maze Mag", date: "2019-07-01" },
      { title: '"Jessie Makinson: Tender Trick at OMR Gallery (Mexico)"', publication: "ArteFuse", date: "2019-07-22" },
      { title: 'Smith, Andy, "The Oil and Watercolor Paintings of Jessie Makinson"', publication: "Hi-Fructose", date: "2019-04-18" },
      { title: 'Walsh, Danielle, "9 of the Most Exciting Artists to Follow from Miami Art Week 2018"', publication: "Vanity Fair", date: "2018-12-13" },
      { title: 'Jessie Makinson, "E.R.O.S."', publication: 'Journal, Issue 7: "The Interior"', date: "2015-11-01" },
    ],
  },
  "parnika-mittal": {
    practice:
      "Parnika Mittal’s paintings emerge from sketches, fragments and emotional notations made in the margins of her journals, often beginning in moments where language feels insufficient. Shaped by experiences of living across cities, countries and temporary homes, Parnika Mittal’s work reflects the residue of movement: fleeting intimacies, emotional dislocation, cultural crossings and the instability of shifting identity. Her faceless figures are not portraits in a literal sense, but vessels for uncertainty, longing, grief and the search for belonging.\n\nFor Parnika Mittal, home is not a fixed place but a fluid, emotional landscape. Through layered surfaces, fractured compositions and abstract forms, she explores the ways memory can both shape and unsettle the self. Parnika Mittal’s paintings hold what cannot always be clearly named — the colour of memory, the shape of goodbye, and the lingering texture of what remains after loss.",
    education: [
      "2017–2019 — MA in Painting, Central Saint Martins, University of the Arts London, London, UK",
      "2016–2017 — Diploma in Graphic Designing, National Institute of Fashion Technology, New Delhi, India",
      "2012–2016 — BA (Hons) Fine Art in Painting, Drawing and Art History, College of Art, New Delhi, India",
      "2011–2012 — Diploma in Fashion Designing, BD Somani International, Mumbai, India",
    ],
    // Source CV lists these under one combined "Select Group & Solo
    // Exhibitions" heading without marking which are which, so `type` is
    // left unset — they render under the page's "Other" bucket.
    exhibitions: [
      { year: "2026", title: "The Mythologies of Colour", venue: "MeSo Ventures, Soho House Mumbai, Mumbai, India" },
      { year: "2025", title: "Artix Artfair", venue: "The Claridges Hotel, New Delhi, India" },
      { year: "2020", title: "2020 Online Juried Show", venue: "Anton Art Centre, Michigan, USA" },
      { year: "2019", title: "Stages of Life", venue: "Harrow Arts Centre, Middlesex, London, UK" },
      { year: "2019", title: "Annette Messenger Show", venue: "The Crossing, Central Saint Martins, London, UK" },
      { year: "2018", title: "Studio Space Tate Exchange", venue: "Tate Modern, London, UK" },
      { year: "2018", title: "Free the voiceless", venue: "King's College Association, Somerset House, London, UK" },
      { year: "2018", title: "Appetite", venue: "Apiary Studios, London, UK" },
      { year: "2018", title: "Central Saint Martins Postgraduate Art Auction", venue: "Lethaby Gallery, London, UK" },
      { year: "2018", title: "Overprint Agitate Activate", venue: "Museum Centre de la Gravure, La Louvière, Brussels, Belgium" },
      { year: "2017", title: "WARD", venue: "Medical School, University of Buckingham, London, UK" },
      { year: "2016", title: "Artistagram", venue: "India Habitat Centre, New Delhi, India" },
      { year: "2015", title: "Gender X,Y,Z", venue: "Gallery Art Laureate, Hilton, New Delhi, India" },
      { year: "2015", title: "Mask Art Show", venue: "KGB Gallery, Los Angeles, USA" },
      { year: "2015", title: "Out There Submission", venue: "Gallery 825 Los Angeles Art Association, Los Angeles, USA" },
      { year: "2014", title: "Colours of India", venue: "Jaipur, India" },
    ],
    awards: [
      "2017 — Nominated for Promising State Artist, Uttar Pradesh, India",
      "2018 — High Houseworking residency with Antony Gormley, Norfolk, England",
    ],
    teaching: [
      "2021–2025 — Art Educator, IBDP Head, Shiv Nadar School, Gurgaon, India",
    ],
  },
  "conor-murgatroyd": {
    practice:
      "Since receiving his BA in Fine Art from Chelsea College of Art in 2016, Conor Murgatroyd's work has been exhibited internationally — at Saatchi Gallery (London), WOAW Gallery (Hong Kong), Chen Projects (Taipei) and Fir Gallery (China). Murgatroyd's practice explores history and philosophy, translated through personal experience. The poetic worlds that he creates are a direct response to the intellectual fusion of images, personal and external. His \"inner landscapes\", which he recreates and works from, are an attempt to render the visible via painting. His paintings act as a stage which brings together the myriad of characters and objects he has come into contact with, both imagined and lived. In Murgatroyd's work he draws attention not to external reality as such, but rather to the unfathomable mystery behind it.",
    education: [
      "2013–2016 — Chelsea College of Art, Fine Art",
      "2011–2013 — Leeds College of Art, Art and Design",
    ],
    exhibitions: [
      { year: "2025", title: "The Glass Key", venue: "Lychee One, London", type: "Solo" },
      { year: "2024", title: "Tick Tock, Tick Tock, Tick Tock", venue: "Woaw Gallery, Hong Kong", type: "Solo" },
      { year: "2023", title: "Through The Looking Glass", venue: "Chen Projects, Taipei", type: "Solo" },
      { year: "2022", title: "Memory of a Voyage", venue: "Chen Projects, Taipei", type: "Solo" },
      { year: "2022", title: "Showstopper", venue: "Saatchi Gallery, London", type: "Group" },
      { year: "2022", title: "Painting In Context", venue: "Fir Gallery, Beijing, China", type: "Group" },
      { year: "2022", title: "Touch Wood", venue: "Eve Leibe Gallery, Berlin", type: "Group" },
      { year: "2022", title: "Talking All Day", venue: "Badr El Jundi, Spain", type: "Group" },
      { year: "2022", title: "Wish Lust", venue: "Kravitz Contemporary, London", type: "Group" },
      { year: "2022", title: "The Uncanny Valley", venue: "The Room, London (with Peter Doyle)", type: "Group" },
      { year: "2021", title: "Relation", venue: "Lychee One, London", type: "Solo" },
      { year: "2021", title: "History's Shadow Marks The Beginning", venue: "Grove Collective, London", type: "Group" },
      { year: "2021", title: "Cave Canem", venue: "Eve Leibe Gallery (online)", type: "Group" },
      { year: "2020", title: "Art in Context", venue: "China", type: "Group" },
      { year: "2020", title: "Group Exhibition", venue: "All Mouth Gallery", type: "Group" },
      { year: "2019", title: "Interiors", venue: "Haggerston, London", type: "Solo" },
      { year: "2017", title: "FBA Futures", venue: "Mall Galleries, London", type: "Group" },
      { year: "2016", title: "Chelsea College of Art Degree Show", venue: "London", type: "Group" },
    ],
    awards: [
      "2017 — FBA Futures Painting Award",
      "2017 — Knights of the Round Table Painting Award",
    ],
    collections: [
      "Yageo Foundation Collection, Taipei — 2023",
      "Cheung Chung-Kiu Collection, China — 2024",
      "Daniel Wolfe Collection, Los Angeles — 2024",
      "Steve Cohen Collection, USA — 2024",
      "De Villepin Collection, France/Hong Kong — 2023",
      "Steve Coogan Collection — 2022",
    ],
  },
  "mengmeng-zhang": {
    practice:
      "Zhang's paintings begin with feeling rather than plan — colour chosen intuitively, marks made in response to psychological states rather than observed reality. Her subjects exist in an ambiguous middle ground: stylised figures that are simultaneously specific and universal, caught in moments of transition, displacement or quiet suspension. The fragmentation of living experience — of being between cultures, between memory and the present, between the self one was and the self one is becoming — runs through every aspect of her practice.\n\nHaving studied across three continents — at the China Academy of Art in Hangzhou, Camberwell College of Arts in London, and the Slade School of Fine Art at UCL — Zhang's work carries the accumulated sensibility of multiple art education traditions. Her MFA at the Slade, completed in 2025, marked a significant development in her practice, deepening her engagement with the materiality of painting and the philosophical questions that underpin it. She is the winner of the 2025 Almacantar Studio Award.",
    education: [
      "2023–2025 — MFA Painting, Slade School of Fine Art, UCL, London, UK",
      "2019–2021 — MA Fine Art Painting, Camberwell College of Arts, University of the Arts London, London, UK",
      "2015–2019 — BA Digital Publishing, China Academy of Art, Hangzhou, China",
    ],
    exhibitions: [
      { year: "2024", title: "Out of Place", venue: "Bonian Space, Beijing, China", type: "Solo" },
      { year: "2025", title: "Illusion", venue: "A Single Piece Gallery, Sydney, Australia", type: "Solo" },
      { year: "2025", title: "Real Artist Sweat", venue: "Tiderip, London, UK", type: "Group" },
      { year: "2025", title: "Everything under the sun", venue: "Arts & Collections, Shanghai, China", type: "Group" },
      { year: "2025", title: "Line Shifu and Bakery Shifu", venue: "Small-Time Project, London, UK", type: "Group" },
      { year: "2025", title: "Pareidolia", venue: "Mandy Zhang Art, London, UK", type: "Group" },
      { year: "2025", title: "Moving Principle", venue: "Arusha Gallery, London, UK", type: "Group" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The Hilight, Battersea, London, UK", type: "Group" },
      { year: "2024", title: "Bloomsbury Festival New Wave Art Prize", venue: "City Lit Gallery, London, UK", type: "Group" },
      { year: "2024", title: "Out of the woods", venue: "Mandy Zhang Art, London, UK", type: "Group" },
      { year: "2024", title: "ART021 Shanghai Contemporary Art Fair", venue: "Shanghai, China", type: "Group" },
      { year: "2023", title: "Art on a Postcard", venue: "Soho Revue, London, UK", type: "Group" },
      { year: "2023", title: "Shadows We Cast", venue: "The Koppel Project Station, London, UK", type: "Group" },
      { year: "2023", title: "Floating", venue: "The Bomb Factory, London, UK", type: "Group" },
      { year: "2022", title: "Selects: Vol. 2", venue: "London Paint Club, London, UK", type: "Group" },
      { year: "2022", title: "Intimacy", venue: "Fitzrovia Gallery, London, UK", type: "Group" },
      { year: "2022", title: "Flux", venue: "Espacio Gallery, London, UK", type: "Group" },
      { year: "2021", title: "UNMUTE", venue: "Copeland Gallery, London, UK", type: "Group" },
    ],
    awards: [
      "2025 — Almacantar Studio Award",
      "2024 — Runner-up, Bloomsbury Festival New Wave Fine Art Competition",
      "2024 — Shortlisted, The Hari Art Prize",
    ],
    press: [
      { title: "Featured artist, Issue 30–31", publication: "ArtMaze Mag", date: "2023-01-01" },
      { title: "'The Space Between'", publication: "London Paint Club", date: "2022-01-01" },
    ],
  },
  "chiedu-okonta": {
    practice:
      "Okonta sees his work as part of a contemporary movement that archives, reports, agitates and questions — through deliberate and objective positioning. His creations reflect a counter-hegemonic worldview that leverages the richness of his cultural heritage, inviting diverse audiences to reflect on their roles within the tapestry of humanity's shared experience. Conscious of the decreasing nature of contemporary attention, his practice is fashioned to captivate viewers and encourage prolonged contemplation. Born into a traditional middle-class Nigerian family, he initially trained as a civil engineer — earning his MSc from the University of East London — before the COVID-19 pandemic prompted a turning point that led him to pursue art full time.\n\nHis ongoing series A Tale of Heritage — which includes The Mariner's Astrolabe (2024) and The Untitled Saltcellar Allegory (2025) — explores the lingering impact of natural resource exploitation and the complex power dynamics surrounding independence and control, drawing on the historic trade between southern Nigeria and the Portuguese. Working across painting, 3D digital art and physical sculpture, the project adopts the visual language of the Benin bronzes as a counter-hegemonic framework, embedding gold, ivory and crude oil as symbolic materials. The series asks what it means to inherit a history of dispossession, and how art can reclaim that narrative.\n\nHis RCA graduate work Focus Alat! (FUBU — For Us By Us) (2025) considers the endless relationship a geographical region has with extractivism. A large-scale painting in acrylic, oil, gel and ink, it is a call for self-dependency, survival and collective rebuilding — a counter-hegemonic vision of the Niger Delta not as a site of exploitation but as a place of rest, renewal and regeneration. The work was sold from the RCA Graduate Show in June 2025 and was highlighted by Blowout Magazine as one of the standout works of the RCA Degree Show 2025.\n\nExploitation's Tattoo (2025) expands his focus from ancestral heritage to a global critique — conversing with Leonardo da Vinci's Salvator Mundi to present a contemporary view in which even prayers for hope are exploited. Throughout his practice, Okonta deploys symbolic colour, material and form with precision — gold for the commercial lingo attributed to natural resources extracted from the Niger Delta over centuries; amorphous black for the carbon soot that has settled over the region due to oil flaring; blue for the psychological depths of humanity's shared crisis.",
    education: [
      "2024–2025 — MA Painting (Sir Frank Bowling Scholar), Royal College of Art, London, UK",
      "2023–2024 — Graduate Diploma, Royal College of Art, London, UK",
      "MSc Civil Engineering, University of East London, London, UK",
    ],
    // Source CV doesn't mark Solo vs. Group for these — `type` left unset,
    // renders under the page's "Other" bucket.
    exhibitions: [
      { year: "2026", title: "Fragments of Memorabilia", venue: "Paris, France" },
      { year: "2026", title: "Un Earthing", venue: "London, UK" },
      { year: "2025", title: "Form & Fable", venue: "London, UK" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The Hilight, Battersea, London, UK" },
      { year: "2025", title: "Poetics of Becoming", venue: "London, UK" },
      { year: "2025", title: "Pertinacious", venue: "London, UK" },
      { year: "2025", title: "Visual Art Open (VAO) 2025 Finalist Exhibition", venue: "London, UK" },
      { year: "2025", title: "The Diasporic Archives", venue: "London, UK" },
      { year: "2025", title: "RCA Graduate Show (RCA2025)", venue: "Royal College of Art, London, UK" },
      { year: "2025", title: "AcrossRCA 2025", venue: "Royal College of Art, London, UK" },
      { year: "2025", title: "Ancestral Utopias", venue: "Howie Street, London, UK" },
      { year: "2025", title: "Past Meets Present Exhibition", venue: "Soho, London, UK" },
      { year: "2025", title: "The Art of Connection Exhibition", venue: "London, UK" },
      { year: "2024", title: "The Tiny Art Show", venue: "London, UK" },
      { year: "2024", title: "Across & Over", venue: "HSBC Headquarters, Canary Wharf, London / Royal College of Art" },
      { year: "2022", title: "Group Exhibition", venue: "Lelie Galerij, Amsterdam, Netherlands" },
      { year: "2022", title: "Group Exhibition", venue: "URBANSIDE Gallery, Zurich, Switzerland" },
    ],
    awards: [
      "2025 — Winner, Visual Art Open (VAO), Painting, Mixed Media & Printmaking Category",
      "2025 — Sir Frank Bowling Scholarship, MA Painting, Royal College of Art",
      "2026 — Studio West Residency (April–August), London",
    ],
    // Chiedu's CV "Experience" section folded in here per instruction —
    // broader than pure teaching, but reuses this field rather than adding
    // another one. "Professional Memberships" (ArtCan, Visual Arts
    // Association, RCA Graduate Community) skipped — no field for it yet.
    teaching: [
      "2026 — Art Consultant, Southfield Academy, London",
      "2023–2024 — Assistant, Drummer Warrior Storyteller Exhibition, London",
      "2012 — Assistant Curator, The Parallax Art Fair, London",
      "2009–2010 — Creative Director, Brain Builder Montessori, Nigeria",
      "2012–2024 — Lecturer (Levels 3–5), Civil Engineering, Construction & Built Environment, various institutions, London and surrounding areas",
    ],
    press: [
      { title: '"A Layered Resistance": Artist in Focus – Chiedu Okonta', publication: "Contemporary Lynx", date: "2025-01-01" },
      { title: "RCA Graduate Show Review", publication: "London Art Roundup", date: "2025-01-01", url: "https://www.londonartroundup.com/reviews/rca-graduate-show-2025" },
      { title: "RCA 2025 – Artists with Something New to Say: RCA Degree Show 2025 Highlights", publication: "BLOWOUT Magazine", date: "2025-01-01" },
      { title: "A Space Between: Interaction and Distance", publication: "M-A (A Space Between)", date: "2023-01-01" },
    ],
  },
  "tiyana-mitchell": {
    practice:
      "Tiyana Mitchell's practice is grounded in photographic archives — family histories, anonymous images, and circulating fragments — approached as living documents rather than fixed records.\n\nHer paintings begin with close looking: the way a gesture, a shadow, a fold in fabric, or a peripheral detail can pull an image out of its original context and into a new narrative. Translating photographs into paint, Mitchell tests what the camera appears to confirm against what memory reshapes over time, asking how images both preserve and distort the lives they depict.\n\nMitchell is also a keen photographer, and her relationship to the archive is guided by care: an attention to the spirit of the original image, even as she crops, isolates, and reframes it. Her paintings often hinge on what is withheld — edges cut away, faces partially obscured, backgrounds softened — creating a productive tension between intimacy and distance. In this way, painting becomes a form of correspondence across generations: an unresolved conversation between granddaughter and grandfather, conducted through the fragments that survive.\n\nThrough strategies of cropping, partial concealment, and subtle shifts in focus, Mitchell's work explores how identity, memory, and belonging are constructed, interrupted, and preserved. By presenting only part of the story, her paintings invite viewers into a shared act of looking — toward what remains just out of reach, and toward what images cannot fully name.",
    education: [
      "2024–2025 — MA in Painting, Royal College of Art, London, UK",
      "2024 — Art Law Course, Sotheby's Institute of Art, London, UK",
      "2019–2023 — BFA in Fine Art, Parsons School of Design, New York, NY, USA",
      "2019–2023 — BA in History, Eugene Lang College of Liberal Arts, The New School, New York, NY, USA",
    ],
    exhibitions: [
      { year: "2026", title: "What Light Remains", venue: "MeSo Ventures at Bvlgari Flagship Boutique, London, UK", type: "Solo" },
      { year: "2025", title: "Conversations Across Time", venue: "Larkin Durey, London, UK", type: "Solo" },
      { year: "2026", title: "Fragments of Memorabilia: Moments for Lebanon", venue: "curated with Hayaty Diaries, Paris, France", type: "Group" },
      { year: "2026", title: "Seams & Veils: Bodies, Archives, and the Threshold of Seeing", venue: "MeSo Ventures, Dubai, UAE", type: "Group" },
      { year: "2025", title: "Winter Salon", venue: "Larkin Durey, London, UK", type: "Group" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures, London, UK", type: "Group" },
      { year: "2025", title: "Second Skin", venue: "Hayaty Diaries, London, UK", type: "Group" },
      { year: "2025", title: "Royal College of Art Public Facing Degree Show", venue: "London, UK", type: "Group" },
      { year: "2025", title: "Parrhesia", venue: "Royal College of Art in collaboration with Roman Road, selected by Marisa Bellani, London, UK", type: "Group" },
      { year: "2025", title: "Faded", venue: "Tiderip, London, UK", type: "Group" },
      { year: "2023", title: "Thank You and Goodnight", venue: "Parsons Fine Art Thesis Exhibition, New York, NY, USA", type: "Group" },
      { year: "2023", title: "Around the World Embassy Tour", venue: "Embassy of Jordan, Washington, DC, USA", type: "Group" },
      { year: "2022", title: "Jazz Club", venue: "Maven Art House, New York, NY, USA", type: "Group" },
    ],
    collections: [
      "Modernist Four Seasons Hotel, Mumbai, India — 2026",
      "Official residence of the Ambassador of Jordan to Washington DC, Washington, DC, USA — 2020",
      "Private collections in France, Switzerland, UK, USA and Jordan",
    ],
    awards: [
      "2022 — Nominated for Yale Norfolk Residency",
      "2019–2022 — Dean's List, Parsons School of Design / Eugene Lang College (GPA 3.88+)",
      "2017 — Pearson Edexcel Award, Art and Design: Photography (highest grade internationally)",
      "2017 — Pearson Edexcel Award, Art and Design: Fine Art (highest grade internationally)",
    ],
    press: [
      { title: 'Tara Parsons, "Tiyana Mitchell: What Light Remains at Bulgari with MeSo Ventures"', publication: "Impulse Magazine", date: "2026-01-01" },
      { title: '"Hayaty Diaries presents Secondskin — an exhibition about touch, memory, and the stories we carry"', publication: "Jdeed Magazine", date: "2025-01-01" },
      { title: 'Vamika Sinha, "Soft Impact: Group Show with Hayaty Diaries at Greatorex"', publication: "Canvas", date: "2025-01-01" },
      { title: 'Tobish Khan, "The Top 5 Art Exhibitions to See in London in August"', publication: "FAD Magazine", date: "2025-01-01" },
      { title: "Featured, Issue 1", publication: "Two Hands Magazine", date: "2025-01-01" },
      { title: 'Len Gordon, "Tiyana Mitchell Paints from the Film of Memory"', publication: "Art Plugged", date: "2025-01-01" },
      { title: 'Eirini Meze, "RCA Degree Show 2025 Highlights: Artists with Something New to Say"', publication: "Blowout Magazine", date: "2025-01-01" },
      { title: 'Marjorie Ding, "Faded: A Curator’s Reflection on Painting, Memory and the Image"', publication: "Tiderip", date: "2025-01-01" },
      { title: '"Faded — Tiyana Mitchell: The Origin of Creation"', publication: "Tiderip", date: "2025-01-01" },
      { title: '"Home Life" (featured artist)', publication: "Washington Life Magazine", date: "2022-10-01" },
      { title: '"Washington Social Diary — College Life"', publication: "Washington Life Magazine", date: "2020-01-01" },
      { title: '"Blue Portrait"', publication: "Parsons Notes", date: "2020-01-01" },
    ],
  },
  "mary-pye": {
    practice:
      "Working without a rigid plan, Mary Pye approaches the canvas as a place for waiting rather than forcing resolution. Forms are allowed to unfold at their own pace, as if the painting is discovered through presence. In this sense, her method draws close to the monastic: disciplined, quiet, and committed to perception as a practice. Subtle gestures, softened edges, and delicately accumulated colour create surfaces that seem to breathe — holding a tension between presence and absence, visibility and concealment.\n\nMary Pye's paintings invite viewers into an intimate encounter with time. Rather than spectacle, they offer a contemplative space — where looking slows, and seeing deepens. As attention moves across their layered fields, the work reveals itself with restraint: light gathers, recedes, and returns; marks hover at the threshold of disappearance; and meaning resides in what is barely there as much as what is declared.",
    education: ["2021–2025 — BA Fine Art, The Slade School of Fine Art, London, UK"],
    // Source CV lists these under one combined "Select Group & Solo
    // Exhibitions" heading without marking which are which, so `type` is
    // left unset.
    exhibitions: [
      { year: "2026", title: "The Mythologies of Colour", venue: "MeSo Ventures, Soho House Mumbai & The KIN Mumbai, Mumbai, India" },
      { year: "2026", title: "Gesture of Memories", venue: "MeSo Ventures, New Delhi, India" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The HiLight, London, UK" },
      { year: "2025", title: "Bloomsbury Festival New Wave Art Prize Exhibition", venue: "Holy Cross Church, London, UK" },
      { year: "2025", title: "Into the Future", venue: "Bulgari and MeSo Ventures, Mayfair, London, UK" },
    ],
    collections: [
      "AdP Museum of Contemporary Art, Ahmedabad, India",
      "Nikolas Tsalamanios Collection, Seaven Management Inc & Mylaki Shipping, Athens, Greece",
    ],
    // Two Blowout Magazine URLs were left as an explicit note in the source
    // doc ("Add this to her press: ...") — included below with their URLs.
    press: [
      { title: "Immerse in this exhibition in Mumbai to explore the diversity of surrealism", publication: "Mid-Day", date: "2026-01-01" },
      { title: "Bulgari x MeSo Ventures: Into the Future exhibition, London, with Mary Pye", publication: "Blowout Magazine", date: "2025-06-27", url: "https://www.blowoutmagazine.com/blowout-art/2025/6/27/bulgari-into-the-future-exhibition-london-with-mary-pye-hosted-meso-ventures" },
      { title: "MeSo Ventures at Frieze New York: A Private Collection", publication: "Blowout Magazine", url: "https://www.blowoutmagazine.com/blowout-art/meso-frieze-new-york-private-collection" },
    ],
  },
  "osman-yousefzada": {
    practice:
      "Osman Yousefzada's practice revolves around modes of storytelling, merging autobiography with fiction and ritual. His work is concerned with the representation and rupture of the migrational experience, making reference to the socio-political issues of today — explored through moving image, installation, text works, sculpture, garment making and performance.\n\nHis practice is described as auto-ethnographic, where personal stories become political. South Asian influences are what many might first see when they encounter his work, but it reaches far broader — unravelling pressing issues of global histories, colonialities, class and race. Osman Yousefzada consistently refuses easy categorisation: his bodies, objects and textiles are presented as part-things that resist fixed identity, insisting instead on the complexity of lives lived across borders.\n\nCentral to his methodology is the figure of his mother — a talented seamstress whose domestic making practice Osman Yousefzada has openly acknowledged as a foundational artistic source. His work is both symbolic of the precarious nature of immigrants' lives, and a tender and complex portrait of a loved one and, by extension, himself. This intimacy sits alongside a boldly political register: his installation When Will We Be Good Enough? drew links between colonial sea routes and the underwater cables that carry today's digital information — both, he argues, viaducts of power.",
    education: [
      "Royal College of Art — PhD Research, Sculpture via Textiles & Ceramics (ongoing), London, UK",
      "Central Saint Martins, London, UK",
      "University of East London — Anthropology, London, UK",
    ],
    // Reconstructed from the source CV's raw "Solo Exhibitions"/"Group
    // Exhibitions" list (years/titles ran together with no separators due
    // to Word list formatting collapsing on export) by cross-referencing
    // against Wikipedia (en.wikipedia.org/wiki/Osman_Yousefzada), which
    // independently confirmed nearly every entry's year/title/venue.
    // "Possession I" (Cartwright Hall) and "Talisman" (venue given in the
    // CV as "Cardian Art, London") could not be verified against Wikipedia
    // — included as written in the CV per instruction, worth confirming
    // with the artist directly if precision matters.
    exhibitions: [
      { year: "2025", title: "Arrivals", venue: "Islamic Biennale, Jeddah, Saudi Arabia (25 January – 25 June)", type: "Solo" },
      { year: "2025", title: "When Will We Be Good Enough?", venue: "The Box, Plymouth, UK (2 November 2024 – 9 March 2025)", type: "Solo" },
      { year: "2025", title: "Possession I", venue: "Cartwright Hall, Lister Park, Bradford, UK", type: "Solo" },
      { year: "2024", title: "Welcome! A Palazzo for Immigrants", venue: "Fondazione Berengo, Palazzo Franchetti, Venice, Italy — presented in conjunction with the 60th International Art Exhibition, La Biennale di Venezia, \"Stranieri Ovunque – Foreigners Everywhere\"", type: "Solo" },
      { year: "2024", title: "Where It Began", venue: "Cartwright Hall Art Gallery, Bradford, UK — a prelude to Bradford City of Culture 2025", type: "Solo" },
      { year: "2024", title: "Queer Feet", venue: "Charleston, Sussex Modern, UK (23 September 2023 – 14 April 2024) — Queer Feet and Works on Paper", type: "Solo" },
      { year: "2023", title: "Embodiments of Memory", venue: "British Ceramics Biennale, The Potteries Museum & Art Gallery, Stoke-on-Trent, UK", type: "Solo" },
      { year: "2023", title: "Rituals and Spells", venue: "Cromwell Place, London, UK", type: "Solo" },
      { year: "2022", title: "What Is Seen & What Is Not", venue: "Victoria & Albert Museum, London, UK", type: "Solo" },
      { year: "2018", title: "Being Somewhere Else", venue: "Ikon Gallery, Birmingham, UK", type: "Solo" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The HiLight, London, UK", type: "Group" },
      { year: "2025", title: "I Hear Her Breathing", venue: "Cooke Latham Gallery, London, UK", type: "Group" },
      { year: "2025", title: "A Home That Will Not Behave", venue: "Bolalne Contemporary, Frieze No.9 Cork Street, London, UK", type: "Group" },
      { year: "2025", title: "Ablutions", venue: "Tate Tanks, Tate Modern, London, UK", type: "Group" },
      { year: "2025", title: "Talisman", venue: "Cardian Art, London, UK", type: "Group" },
      { year: "2023", title: "Drawing Biennale", venue: "London, UK", type: "Group" },
      { year: "2023", title: "More Immigrants Please", venue: "Billboard series commissioned by Artichoke", type: "Group" },
      { year: "2023", title: "New Contemporaries", venue: "Camden Art Centre, London, UK", type: "Group" },
      { year: "2023", title: "Sculpture", venue: "Vadehra Gallery, New Delhi, India", type: "Group" },
      { year: "2023", title: "A New Dawn, A New Day", venue: "Bomb Factory Art Foundation, Marylebone, London, UK", type: "Group" },
      { year: "2023", title: "Terra", venue: "Couvent des Jacobins, Burgundy, France", type: "Group" },
      { year: "2023", title: "Like Paradise", venue: "Claridge's Art Space, London, UK", type: "Group" },
      { year: "2023", title: "Life is More Important Than Art", venue: "Whitechapel Gallery, London, UK — \"An Immigrant's Room of Her Own\", new commission & iteration of former installation", type: "Group" },
      { year: "2023", title: "One That Includes Myth", venue: "Goodman Gallery, London, UK", type: "Group" },
      { year: "2023", title: "Brink", venue: "Royal College of Art, London, UK", type: "Group" },
      { year: "2023", title: "Alea Iacta Est", venue: "Vistamare, Milan, Italy — curated by Milovan Farronato, with Anthea Hamilton, Celia Hempton, Goshka Macuga, Eddie Peake, Prem Sahib, Lucy McKenzie, Mariya Loboda, Christodoulos Panayiotou", type: "Group" },
      { year: "2022", title: "Spaces of Transcendence", venue: "Museum of Contemporary Art Australia, Sydney, Australia", type: "Group" },
      { year: "2022", title: "Glasstress", venue: "Berengo Fondazione, Venice, Italy", type: "Group" },
      { year: "2021", title: "Infinity Pattern 1", venue: "Ikon Gallery & Selfridges, Birmingham, UK (public art installation, selected via international competition)", type: "Group" },
      { year: "2020", title: "Radical Figures: Painting in the New Millennium", venue: "Whitechapel Gallery, London, UK — \"Her Dreams Are Bigger\" & panel discussion", type: "Group" },
      { year: "2020", title: "Malevich Symposium: The Power of Sound", venue: "180 Strand, London, UK — performative costumes for Haroon Mirza", type: "Group" },
      { year: "2020", title: "A Rich Tapestry", venue: "Lahore Biennale, Lahore, Pakistan — curated by Jonathan Watkins & Ayesha Khalid, new commission for \"Huis-Clos (No Exit)\"", type: "Group" },
      { year: "2020", title: "Between the Sun and the Moon", venue: "Lahore Biennale, Lahore, Pakistan — collaboration with Haroon Mirza on \"A belief is not the truth because the truth is unbelievable\"", type: "Group" },
      { year: "2019", title: "Nightfall", venue: "Mendes Wood DM, Brussels, Belgium — curated by Fernanda Brenner, Milovan Farronato, Erika Verzutti", type: "Group" },
      { year: "2018", title: "Volcano Extravaganza", venue: "Fiorucci Art Trust, Stromboli, Italy — performance with Cecilia Bengolea and Haroon Mirza", type: "Group" },
      { year: "2018", title: "Total Anastrophes", venue: "Dhaka Art Summit, Dhaka, Bangladesh — curated by Runa Islam and Milovan Farronato", type: "Group" },
      { year: "2018", title: "The Fabric of India", venue: "Cincinnati Art Museum, Ohio, USA — toured by V&A Museum", type: "Group" },
      { year: "2017", title: "The Fabric of India", venue: "Ringling Museum, Florida, USA", type: "Group" },
      { year: "2013", title: "The Wedding Dresses 1775–2014", venue: "V&A Museum, London, UK", type: "Group" },
      { year: "2011–2012", title: "Reconstruction", venue: "British Council — Lahore Museum (Lahore), Central State Museum (Almaty), Georgian National Museum (Tbilisi), Style.uz (Tashkent), Bangladesh National Museum (Dhaka)", type: "Group" },
      { year: "2008", title: "Design of the Year Awards", venue: "Design Museum, London, UK", type: "Group" },
      { year: "2005", title: "Jerwood: Fashion, Film and Fiction", venue: "The Wapping Project, London, UK", type: "Group" },
    ],
    collections: ["Victoria & Albert Museum, London, UK", "Design Museum, London, UK"],
    press: [
      { title: "The Go-Between (memoir)", publication: "Canongate", date: "2023-01-01" },
      { title: '"It Can’t Be Ignored: Osman Yousefzada on His Gigantic Artwork"', publication: "The Art Newspaper", date: "2022-01-01" },
      { title: '"A Migrant’s Tale Laid Bare"', publication: "Financial Times" },
      { title: '"Artist Osman Yousefzada’s New Show Is a Personal Reflection on Migration"', publication: "Vogue UK" },
      { title: '"On Racism and British Fashion"', publication: "The New York Times", date: "2020-01-01" },
      { title: '"Shades of Unity in Hope of a New Brown and Black"', publication: "The Guardian" },
      { title: "Feature", publication: "i-D Magazine" },
      { title: "Feature", publication: "Dazed" },
      { title: "Feature", publication: "Flash Art" },
      { title: "Artist profile", publication: "Wikipedia", url: "https://en.wikipedia.org/wiki/Osman_Yousefzada" },
    ],
  },
  "lydia-hamblet": {
    practice:
      "Lydia Hamblet's paintings begin with close observation — of weather patterns, shifting light, and the restless energy of urban and natural spaces. Working primarily in oil and oil bar on large-scale canvases, she builds layered, abstracted surfaces that carry the urgency of mark-making alongside a sensitivity to atmosphere and mood. Rather than depicting specific places, Hamblet's work distils a felt encounter with landscape — the physical disturbance of a tennis court mid-play, the calm weight of water in winter, the vibrant pulse of a city skyline at dusk.\n\nHer large-scale public installations bring this sensibility into shared urban space, inviting passersby to encounter abstraction in everyday settings. In 2023 she was commissioned by Canary Wharf to create Together, Basking on the South Quay — a 15-metre hand-painted mural that is the only work in the UK's largest free outdoor public art collection to have been created on-site by the artist.\n\nHamblet works as a constant observer. Her subjects — local parks, sports facilities, rivers and shorelines — are not chosen for picturesque appeal but for the energy and memory they hold. She encourages viewers to connect with the weather imprints and memories they see in her art in their own way. Her work is held in the permanent collections of the Pérez Art Museum Miami (PAMM), Canary Wharf, and Clifford Chance.",
    education: [
      "2018–2020 — MA Printmaking (Distinction), Royal College of Art, London, UK",
      "2014–2017 — BA Illustration (First Class Honours), Camberwell College of Arts, University of the Arts London, London, UK",
      "Topolski Studio Reportage Residency, London, UK",
    ],
    exhibitions: [
      { year: "2025", title: "The Art of Colour", venue: "MeSo Ventures x Bulgari, New Bond Street, London, UK", type: "Solo" },
      { year: "2025", title: "Meeting Place", venue: "Galleria Palla Blu, San Remo, Italy", type: "Solo" },
      { year: "2024", title: "Breeze", venue: "Enari Gallery, Amsterdam, Netherlands (duo show)", type: "Solo" },
      { year: "2023", title: "Noises in the Florid Sky", venue: "Pictorum Gallery, London, UK", type: "Solo" },
      { year: "2022", title: "Two Months of Something", venue: "AMP Gallery, London, UK", type: "Solo" },
      { year: "2026", title: "Lull'd In These Flowers", venue: "Soho Revue, London, UK", type: "Group" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The HiLight, Battersea, London, UK", type: "Group" },
      { year: "2025", title: "Amelie & Daniel Linsey Foundation Fundraising Ball Art Auction", venue: "The Peninsula London, London, UK", type: "Group" },
      { year: "2025", title: "Poetry of the Earth", venue: "Wilder Gallery, London, UK", type: "Group" },
      { year: "2025", title: "Two", venue: "Haricot Gallery, London, UK", type: "Group" },
      { year: "2024", title: "A Journey Into the Unknown", venue: "Haricot Gallery, London, UK", type: "Group" },
      { year: "2023", title: "Flares in the Darkroom", venue: "The Who Gallery, London, UK", type: "Group" },
      { year: "2023", title: "Together, Basking on the South Quay", venue: "Canary Wharf Permanent Collection, London, UK (public commission)", type: "Group" },
      { year: "2022", title: "Taking A Broom to the Wasp's Nest", venue: "Pictorum Gallery, London, UK", type: "Group" },
      { year: "2021", title: "50x50 with The Auction Collective", venue: "Soho Revue, London, UK", type: "Group" },
      { year: "2020", title: "London Grads Now", venue: "Saatchi Gallery, London, UK", type: "Group" },
    ],
    awards: [
      "2020 — Clifford Chance Printmaker's Purchase Prize",
      "Print Makers Appeal Fund, Royal College of Art",
      "Shortlisted, Clyde & Co Art Award",
      "Kingsgate Project Space Billboard Commission",
    ],
    collections: [
      "Pérez Art Museum Miami (PAMM)",
      "Canary Wharf Permanent Collection — Together, Basking on the South Quay (15-metre hand-painted mural, 2023)",
      "Clifford Chance Corporate Collection, 2020",
    ],
  },
  "joya-mukerjee-logue": {
    practice:
      "Mukerjee Logue gathers visual cues from lived experience and collected imagery, developing scenes shaped by light, tone and the subtle charge of being together. Her figures hover at the edge of clarity — held together by light more than line — as if the surrounding air were drawing them into being. Edges soften, attention slows, and what emerges is the quiet choreography of human interaction: the fragile circuits of connection that make social life feel both staged and alive.\n\nHer practice is deeply informed by her mixed heritage — raised in Ohio with yearly visits to her ancestral home in Ambala, Haryana, India, where her family settled in 1845. This dual inheritance — American Midwest and northern India — runs through her choice of subjects: women in saris, domestic interiors, family gatherings, the warm haze of diffused sunlight and faded colour. Rather than painting from photographs, Mukerjee Logue works from memory and imagination, treating her scenes as atemporal — assembled from jumbled recollections of faces, dispositions and places rather than fixed moments in time.\n\nHer artistic formation developed through sustained, largely self-directed study, drawing on the observational discipline of her scientific education — degrees in biology, chemistry and psychology — and the perceptual acuity those disciplines demand. She is represented in India by Vadehra Art Gallery, New Delhi and in the United States and Europe by Ruttkowski;68.",
    education: [
      "St Mary's College, Notre Dame, Indiana, USA — BS Biology, Chemistry & Psychology",
      "Largely self-directed studio practice",
    ],
    exhibitions: [
      { year: "2026", title: "Your Presence Is Requested", venue: "Ruttkowski;68, New York, USA", type: "Solo" },
      { year: "2024", title: "Those Who Walk Before Me", venue: "Vadehra Art Gallery, New Delhi, India", type: "Solo" },
      { year: "2023", title: "Memory Keepers", venue: "Cromwell Place, London, UK", type: "Solo" },
      { year: "2023", title: "Memoir", venue: "Cromwell Place, London, UK", type: "Solo" },
      { year: "2026", title: "Without Fixed Form", venue: "Ruttkowski;68 & Penske Projects, Paris, France", type: "Group" },
      { year: "2025", title: "Frieze London", venue: "Vadehra Art Gallery, London, UK", type: "Group" },
      { year: "2025", title: "Untitled Houston", venue: "Rajiv Menon Contemporary, Houston, USA", type: "Group" },
      { year: "2025", title: "Delhi Contemporary Art Week", venue: "Vadehra Art Gallery, New Delhi, India", type: "Group" },
      { year: "2025", title: "Contemporary Art", venue: "Vadehra Art Gallery with Ashvita's Art Gallery, Lalit Kala Akademi, Chennai, India", type: "Group" },
      { year: "2025", title: "Art Basel Hong Kong", venue: "Vadehra Art Gallery, Hong Kong", type: "Group" },
      { year: "2025", title: "Exhibitionism", venue: "Rajiv Menon Contemporary, Los Angeles, USA", type: "Group" },
      { year: "2025", title: "India Art Fair", venue: "Vadehra Art Gallery, New Delhi, India", type: "Group" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The HiLight, Battersea, London, UK", type: "Group" },
      { year: "2024", title: "Art Mumbai", venue: "Vadehra Art Gallery, Mumbai, India", type: "Group" },
      { year: "2024", title: "Delhi Contemporary Art Week", venue: "Vadehra Art Gallery, New Delhi, India", type: "Group" },
      { year: "2024", title: "London Gallery Weekend", venue: "Frieze No.9 Cork Street, Vadehra Art Gallery, London, UK", type: "Group" },
      { year: "2023", title: "Happy When It Rains", venue: "High Line Nine, New York, USA", type: "Group" },
      { year: "2023", title: "London Calling", venue: "Cromwell Place, London, UK", type: "Group" },
      { year: "2022", title: "Welcome Home", venue: "21c Museum, Cincinnati, Ohio, USA", type: "Group" },
      { year: "2021", title: "Soul Plates: Pass the Culture", venue: "Annex Gallery, Cincinnati, Ohio, USA", type: "Group" },
      { year: "2019", title: "Razia's Garden (installation)", venue: "Contemporary Art Center, Cincinnati, Ohio, USA", type: "Group" },
    ],
    collections: ["Kiran Nadar Museum of Art, New Delhi, India", "Kasturbhai Lalbhai Museum, Ahmedabad, India"],
    // A long "additional press in ..." outlet list (Harper's Bazaar India,
    // Times of India, etc.) was in the source doc with no individual
    // titles/dates/links, so it's omitted here rather than fabricated.
    press: [
      { title: "Joya Mukerjee Logue's First Solo Show in India Is a Tribute to Her Family and Home", publication: "Architectural Digest India", url: "https://www.architecturaldigest.in/story/joya-mukerjee-logues-first-solo-show-in-india-is-a-tribute-to-her-family-and-home/" },
      { title: "Artist Joya Mukherjee Logue Hosts a Solo Art Exhibition in New Delhi", publication: "Indian Express – Indulge", date: "2024-08-27", url: "https://www.indulgexpress.com/culture/art/2024/Aug/27/artist-joya-mukherjee-logue-hosts-a-solo-art-exhibition-in-new-delhi" },
      { title: "Saris, Stories, Memories: An Indian-American's Gaze at Ambala Over Five Generations in Art", publication: "The Print", url: "https://theprint.in/feature/around-town/saris-stories-memories-an-indian-americans-gaze-at-ambala-over-five-generations-in-art/2246782/" },
      { title: "Paint in Memory", publication: "India Today", date: "2024-09-16", url: "https://www.indiatoday.in/magazine/leisure/story/20240916-art-by-joya-mukerjee-logue-paint-in-me-mory-2594909-2024-09-06" },
      { title: "A Permanent Presence of the Past", publication: "New Indian Express", date: "2024-09-14", url: "https://www.newindianexpress.com/magazine/2024/Sep/14/a-permanent-presence-of-the-past" },
      { title: "Those Who Walk Before Me", publication: "The Hindu", url: "https://www.thehindu.com/entertainment/art/joya-mukerjee-logue-those-who-walk-before-me-vadehra-art-gallery-ambala-cantt-memoirist-archivist-paintings/article68625020.ece" },
      { title: "Home Is Where the Art Is", publication: "New Indian Express", date: "2024-09-10", url: "https://www.newindianexpress.com/cities/delhi/2024/Sep/10/home-is-where-the-art-is" },
      { title: "Brushstrokes of Heritage and Memory in Indian-American Artist Joya Mukerjee Logue's Work", publication: "The Tribune", url: "https://www.tribuneindia.com/news/spectrum/brushstrokes-of-heritage-and-memory-in-indian-american-artist-joya-mukerjee-logues-work/" },
      { title: "Those Who Walk Before Me", publication: "Platform Mag", url: "https://www.platform-mag.com/art/those-who-walk-before-me.html" },
      { title: "Joya Mukerjee Logue Harnesses Identity and Belonging at Vadehra Art Gallery", publication: "Stir World", url: "https://www.stirworld.com/see-features-joya-mukerjee-logue-harnesses-identity-and-belonging-at-vadehra-art-gallery" },
      { title: 'Sadaf Shaikh, "Joya Mukerjee Logue’s Workspace Is a Painting-Within-a-Painting Marvel"', publication: "Vogue India", date: "2023-03-01" },
    ],
  },
  "kubra-aliyeva": {
    practice:
      "Kubra Aliyeva is drawn to materials that carry their own tactility and vulnerability, using them to develop a practice grounded in repetition, layering, and repair. Working slowly and by hand — accumulating, stitching, binding, reworking, and mending — she treats these gestures as both process and language. Repetition becomes a way of holding time; layering gathers what has been carried; repair is not a correction but a visible record of endurance, care, and continuation. Through this material vocabulary, her work speaks to forms of labour that are frequently overlooked, and to the quiet resilience required to sustain memory over time.\n\nRather than presenting remembrance as a fixed or linear narrative, Kubra Aliyeva approaches memory as something physical — handled, reworked, and preserved through touch. Her installations create sensorial environments in which viewers encounter memory through the body. Suspended forms, traces, and textured surfaces invite proximity and attentiveness, allowing meaning to emerge through presence rather than explanation.\n\nIn recent work, Aliyeva reclaims camouflage as a feminist strategy of visibility. Shifting it from concealment to assertion, she exposes what has been trained to disappear and insists on the right to be seen — making present what is often expected to remain quiet or unseen.",
    education: [
      "2025–2026 — Graduate Diploma in Art & Design, Royal College of Art (RCA), London, UK",
      "2024 — Foundation, City & Guilds of London Art School, London, UK",
    ],
    // Source doc doesn't mark Solo vs. Group — `type` left unset.
    exhibitions: [
      { year: "2026", title: "Gesture of Memories", venue: "MeSo Ventures, New Delhi, India" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The HiLight, London, UK" },
      { year: "2025", title: "Royal Academy of Arts Summer Exhibition", venue: "London, UK" },
      { year: "2024", title: "Milan Art Fair", venue: "Milan, Italy" },
      { year: "2023", title: "Ruth Borchard Collection, Self Portrait Prize Exhibition", venue: "London, UK" },
      { year: "2021", title: "New English Art Club Annual Exhibition", venue: "Mall Galleries, London, UK" },
    ],
    // Two URLs were left as an explicit note in the source doc ("Add this
    // to press publications") — included below with their URLs.
    press: [
      { title: "Between Worlds: MeSo Ventures Group Show", publication: "Blowout Magazine", url: "https://www.blowoutmagazine.com/blowout-art/between-worlds-meso-ventures-group-show" },
      { title: "Emerging Talent: Highlights from London's First 2025 Student Shows", publication: "Blowout Magazine", date: "2025-05-28", url: "https://www.blowoutmagazine.com/blowout-art/2025/5/28/emerging-talent-highlights-from-londons-first-2025-student-shows" },
    ],
  },
  "tallulah-hutson": {
    practice:
      "Tallulah Hutson is a London-born and London-based figurative oil painter whose work is driven by the expressive charge of the body — how a single stance, glance, or movement can contain an entire atmosphere. Her practice began in portraiture and has expanded into depictions of figures in ambiguous states of motion: dancing, surrendering, resisting, transforming. Across these scenes, Hutson is drawn to \"deeply evocative, intimate moments that occur amidst the mundane,\" whether that's a fleeting encounter or the sweat-lit release of a dancefloor.\n\nHutson's approach is grounded in rigorous training from life. After growing up in London, she travelled to Florence to study drawing and portraiture at Charles H. Cecil Studios, including the sight-size method and an emphasis on observation under natural light. She later returned to London to continue developing her studio practice with The Bomb Factory Art Foundation, where she has been a resident artist since 2021, and undertook an intensive residency in New York City in late 2023.\n\nHer recent work focuses on the release and elation people experience when surrendering to sound, drawing parallels between contemporary encounters with music and older visual traditions of spiritual intensity. By referencing historic religious artworks — once used to depict revelation, ecstasy, and social \"importance\" — she reclaims that sense of reverie for ordinary lives and contemporary bodies.\n\nThat reverie is never simple. Hutson's dancing figures hover between states: delight and distress, transcendence and collapse. Hellscape hints and sharpened atmospheres reflect a world \"constantly in crisis,\" asking whether dancing in the face of disaster becomes defiance, escapism, or despair. The colour red is central — evoking club lights and late nights, but also heat, passion, and violence — holding both the seduction and the stakes of the present tense.",
    education: [
      "2024–2025 — MA in Painting, Royal College of Art, London, UK",
      "2019–2021 — Atelier Training, Charles H. Cecil Studios, Florence, Italy",
    ],
    exhibitions: [
      { year: "2024", title: "Flowers on the Underground", venue: "Bomb Factory Art Foundation, Archway Gallery, London, UK", type: "Solo" },
      { year: "2026", title: "Seams & Veils: Bodies, Archives, and the Threshold of Seeing", venue: "MeSo Ventures, Dubai, UAE", type: "Group" },
      { year: "2025", title: "Between Worlds", venue: "MeSo Ventures at The HiLight, London, UK", type: "Group" },
      { year: "2025", title: "Herbert Smith Freehills Kramer Portrait Award", venue: "National Portrait Gallery, London, UK", type: "Group" },
      { year: "2025", title: "RCA25", venue: "Royal College of Art Painting Building, London, UK", type: "Group" },
      { year: "2025", title: "Becoming of Memory", venue: "Arts Archive London, London, UK", type: "Group" },
      { year: "2025", title: "CHIASMATA", venue: "Greatorex Street, London, UK", type: "Group" },
      { year: "2025", title: "On Paper", venue: "The Crit Room, Royal College of Art, London, UK", type: "Group" },
      { year: "2025", title: "Rejection: When No Said Yes", venue: "Hangar Gallery, Royal College of Art, London, UK", type: "Group" },
      { year: "2023", title: "Bomb Factory Artists: Christmas Exhibition", venue: "Bomb Factory Art Foundation, Marylebone Gallery, London, UK", type: "Group" },
      { year: "2023", title: "Falling Leaves from Babel", venue: "Unit 300, UNCOOL ARTIST, New York, USA", type: "Group" },
    ],
    awards: [
      "2023 — Finalist, Portraiture Category & Fully From Life Category, 16th International ARC Salon Competition (\"Man Looking Back\")",
      "2023 — Finalist, Fully From Life Category, 16th International ARC Salon Competition (\"Francesco the Smiling Man\")",
      "2023 — UNCOOL ARTIST Residency, New York, USA (8 weeks)",
      "2021–present — Resident Artist, Bomb Factory Art Foundation, London",
    ],
    press: [
      { title: 'Sophia Dearie, "Finding Artistic Identity"', publication: "The Guide Magazine, Volume 3", date: "2025-01-01" },
      { title: "International Realism", publication: "16th International ARC Salon, ACC Art Books", date: "2023-01-01" },
      { title: "Between Worlds: MeSo Ventures Group Show", publication: "Blowout Magazine", url: "https://www.blowoutmagazine.com/blowout-art/between-worlds-meso-ventures-group-show" },
    ],
  },
};

const run = async () => {
  for (const artist of artists) {
    const slug = slugify(artist.name);
    const extra = richData[slug] || {};

    const doc = {
      _id: `artist-${slug}`,
      _type: "artist",
      name: artist.name,
      slug: { _type: "slug", current: slug },
      location: artist.location,
      discipline: artist.discipline,
      bio: bioBlock(artist.bio),
      featured: Boolean(artist.featured),
      ...(extra.practice ? { practice: extra.practice } : {}),
      ...(extra.education ? { education: extra.education } : {}),
      ...(extra.exhibitions
        ? {
            exhibitions: extra.exhibitions.map((entry, i) => ({
              _type: "exhibitionEntry",
              _key: `ex${i}`,
              ...entry,
            })),
          }
        : {}),
      ...(extra.collections ? { collections: extra.collections } : {}),
      ...(extra.awards ? { awards: extra.awards } : {}),
      ...(extra.teaching ? { teaching: extra.teaching } : {}),
      ...(extra.press
        ? {
            press: extra.press.map((entry, i) => ({
              _type: "pressEntry",
              _key: `pr${i}`,
              ...entry,
            })),
          }
        : {}),
    };

    const portrait = await uploadPortrait(slug);
    if (portrait) doc.portrait = portrait;

    await client.createOrReplace(doc);
    console.log(
      `Seeded: ${artist.name} (${slug})${portrait ? " [+ portrait]" : ""}${
        richData[slug] ? " [+ rich data]" : ""
      }`
    );
  }
  console.log(`\nDone — ${artists.length} artists seeded.`);
  const missingPortraits = artists.filter(
    (a) => !fs.existsSync(path.join(ARTIST_DATA_DIR, slugify(a.name)))
  );
  if (missingPortraits.length > 0) {
    console.log(
      `Portraits/rich data still missing for: ${missingPortraits
        .map((a) => a.name)
        .join(", ")} — add a folder under scripts/artist-data/<slug>/ and re-run.`
    );
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
