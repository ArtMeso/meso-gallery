// Bulk patch from the full-roster press discovery sweep.
//
// Everything here was found by searching each artist's own site and their
// galleries' press pages first, then broad web search, and verified as being
// about the right artist. Conor Murgatroyd's identity was confirmed against
// MeSo's own record (b.1995 Bradford, Chelsea BA 2016, Knights of the Round
// Table award, Lychee One / WOAW / Grove Collective shows all match).
//
// Where only a year is known the date is YYYY-01-01: the artist page renders
// just the year, and this keeps chronological sorting correct. Entries with no
// determinable date are left undated rather than guessed, and sort last.
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

const e = (key, title, publication, date, url) => ({
  _key: key,
  _type: "pressEntry",
  title,
  publication,
  ...(date ? { date } : {}),
  url,
});

const BETWEEN_WORLDS =
  "https://www.blowoutmagazine.com/blowout-art/between-worlds-meso-ventures-group-show";

const additions = {
  "artist-conor-murgatroyd": [
    e("cm01", "“Conor Murgatroyd’s obsession with history fuels his colourful and allegorical paintings”", "It's Nice That", "2023-09-06", "https://www.itsnicethat.com/articles/conor-murgatroyd-art-060923"),
    e("cm02", "“Conor Murgatroyd’s paintings celebrate the multiculturalism of Britain today”", "It's Nice That", "2020-09-17", "https://www.itsnicethat.com/articles/conor-murgatroyd-painting-art-170920"),
    e("cm03", "“Conor Murgatroyd Interview — ‘I love good characters, they’re what makes the world go round’”", "FAD Magazine", "2021-08-11", "https://fadmagazine.com/2021/08/11/conor-murgatroyd-interview-i-love-good-characters-theyre-what-makes-the-world-go-round-and-the-places-i-paint-are-full-of-them/"),
    e("cm04", "“The Upcoming: Normality & Other Wonders”", "FAD Magazine", "2021-08-17", "https://fadmagazine.com/2021/08/17/the-upcoming-normality-other-wonders/"),
    e("cm05", "“Conor Murgatroyd’s paintings inspire hope for summers to come”", "The Face", "2020-08-28", "https://theface.com/culture/wavey-garms-andres-branco-conor-murgatroyd-painting-art-london-subcultures"),
    e("cm06", "“British art special”", "The Face", "2020-12-29", "https://theface.com/culture/british-art-special-emerging-artists-uk-volume-4-issue-5"),
    e("cm07", "“Artist Conor Murgatroyd on locality, optimism and hope”", "The Face", "2021-04-09", "https://theface.com/culture/conor-murgatroyd-windows-exhibition-painting-artist-contemporary-art-lockdown"),
    e("cm08", "“Raising Boys: adolescence, masculinity and the blurry lines where they meet”", "The Face", "2022-06-21", "https://theface.com/culture/raising-boys-adolescence-masculinity-mens-mental-health-hackney-exhibition-art-artists-peter-doyle-leon-scott-engels-conor-murgatroyd-benjamin-murphy"),
    e("cm09", "“Conor Murgatroyd Captures The Banality Of Everyday Life”", "Art Plugged", "2021-04-15", "https://artplugged.co.uk/conor-murgatroyd-captures-the-banality-of-everyday-life/"),
    e("cm10", "“Conor Murgatroyd: RELATION”", "Art Plugged", "2021-08-03", "https://artplugged.co.uk/conor-murgatroyd-relation/"),
    e("cm11", "Jacob Barnes, critical essay on Conor Murgatroyd", "COEVAL Magazine", "2021-06-24", "https://www.coeval-magazine.com/coeval/conor-murgatroyd"),
    e("cm12", "“History’s Shadow Marks the Beginning at Grove Collective”", "Art Spiel", "2021-01-01", "https://artspiel.org/historys-shadow-marks-the-beginning-at-grove-collective/"),
    e("cm13", "“Conor Murgatroyd — Lychee One”", "The Editorial Magazine", "2021-01-01", "http://the-editorialmagazine.com/conor-murgatroyd-lychee-one/"),
    e("cm14", "Conor Murgatroyd", "Young Artists in Conversation", "2022-01-01", "https://youngartistsinconversation.co.uk/Conor-Murgatroyd"),
    e("cm15", "Conor Murgatroyd", "Dead Art Magazine", "2020-01-01", "https://www.deadartmag.co.uk/art-3/conor-murgatroyd"),
    e("cm16", "Conor Murgatroyd — Creative Living studio visit", "Goodhood", null, "https://goodhoodstore.com/en-us/blogs/features/conor-murgatroyd"),
    e("cm17", "“How I Wear It: Retro-Modern Artist Conor Murgatroyd”", "MR PORTER", "2022-01-01", "https://www.mrporter.com/en-no/journal/fashion/how-i-wear-it-retro-modern-artist-conor-murgatroyd-style-10471492"),
    e("cm18", "Too Hot Limited C.P. Company / Stone Island deadstock feature", "Hypebeast", "2021-11-01", "https://hypebeast.com/2021/11/too-hot-limited-cp-company-stone-island-deadstock-1990s-conor-murgatroyd"),
    e("cm19", "“Kickers Class of 50”", "Kickers", "2020-01-01", "https://blog.kickers.co.uk/adults/kickers-class-of-50.html"),
    e("cm20", "“Conor Murgatroyd wins £1,500 Knights of the Round Table Award at Summer Shows 2016”", "University of the Arts London — Chelsea College of Arts", "2017-01-01", "https://www.arts.ac.uk/colleges/chelsea-college-of-arts/stories/conor-murgatroyd-wins-1500-knights-of-the-round-table-award-at-summer-shows-2016"),
  ],
  "artist-lydia-hamblet": [
    e("lh01", "“Together, Basking On The South Quay: Hand-Painted Mural Joins The UK’s Largest Outdoor Free-To-Visit Public Art Collection”", "Canary Wharf Group", "2023-11-10", "https://group.canarywharf.com/press-release/together-basking-on-the-south-quay-101123/"),
    e("lh02", "“Canary Wharf mural commission for artist Lydia Hamblet”", "East London Advertiser", "2023-11-12", "https://www.eastlondonadvertiser.co.uk/news/23912844.canary-wharf-mural-commission-artist-lydia-hamblet/"),
    e("lh03", "“Canary Wharf welcomes new mural by London-based visual artist Lydia Hamblet”", "London Post", "2023-11-15", "https://london-post.co.uk/canary-wharf-welcomes-new-mural-by-london-based-visual-artist-lydia-hamblet/"),
    e("lh04", "“A 15 metre hand-painted mural by artist Lydia Hamblet in Canary Wharf”", "The Capturist", "2023-11-16", "https://www.thecapturist.com/posts/a-15-metre-hand-painted-mural-by-artist-lydia-hamblet-in-canary-wharf"),
    e("lh05", "“Lydia Hamblet at Pictorum Gallery”", "Art Is Alive", "2023-08-29", "https://artisalive.co.uk/2023/08/29/lydia-hamblet-at-pictorum-gallery/"),
    e("lh06", "“MUNTHE Art Monday: Lydia Hamblet”", "MUNTHE", null, "https://www.en.munthe.com/blogs/munthe-art-monday/munthe-art-monday-lydia-hamblet"),
  ],
  "artist-mary-pye": [
    e("mp-bw", "“Between Worlds: MeSo Ventures Unveils A Group Exhibition at The Hilight Battersea”", "Blowout Magazine", "2025-12-27", BETWEEN_WORLDS),
    e("mp-et", "“Emerging Talent: Highlights from London’s First 2025 Student Shows”", "Blowout Magazine", "2025-05-28", "https://www.blowoutmagazine.com/blowout-art/2025/5/28/emerging-talent-highlights-from-londons-first-2025-student-shows"),
  ],
  "artist-parnika-mittal": [
    e("pm-sg", "Noor Anand Chawla, “Artix 4.0 shines a light on India’s artistic talent in a unique setting”", "The Sunday Guardian", "2025-08-17", "https://sundayguardianlive.com/feature/artix-40-shines-a-light-on-indias-artistic-talent-in-a-unique-setting-137218/"),
    e("pm-cal", "“Artix 4.0 Returns to New Delhi: A Celebration of Art, Culture and Creativity”", "Caleidoscope", "2025-08-18", "https://caleidoscope.in/art-culture/artix-4-0-delhi"),
    e("pm-ct", "“India’s Only Hotel Art Fair Is Back: Artix 4.0 To Reimagine Exhibition Spaces This August In Delhi”", "Curly Tales", "2025-07-29", "https://curlytales.com/india/experiences/indias-only-hotel-art-fair-is-back-artix-to-reimagine-exhibition-spaces-this-august-in-delhi/"),
    e("pm-bnw", "“Artix 4.0: India’s First Hotel Art Fair Showcases Young and Emerging Artists”", "Business News This Week", "2025-08-07", "https://businessnewsthisweek.com/news/artix-4-0-indias-first-hotel-art-fair-showcases-young-and-emerging-artists/"),
  ],
  "artist-chiedu-okonta": [
    e("co-vao1", "“Chiedu Okonta: Painting the Intersections of Culture, Place, and Global Issues”", "Visual Art Open", "2026-02-13", "https://www.visualartopen.com/post/chiedu-okonta-painting-the-intersections-of-culture-place-and-global-issues"),
    e("co-vao2", "“One Month Later: Celebrating the Visual Art Open 2025 Finalist Exhibition”", "Visual Art Open", "2025-11-12", "https://www.visualartopen.com/post/visual-art-open-2025-finalist-exhibition"),
    e("co-bw", "“Between Worlds: MeSo Ventures Unveils A Group Exhibition at The Hilight Battersea”", "Blowout Magazine", "2025-12-27", BETWEEN_WORLDS),
  ],
  "artist-joya-mukerjee-logue": [
    e("jml-wp", "Aastha D, “New gallery Rajiv Menon Contemporary brings contemporary South Asian and diasporic art to Los Angeles”", "Wallpaper*", "2025-03-03", "https://www.wallpaper.com/art/exhibitions-shows/new-gallery-rajiv-menon-los-angeles"),
    e("jml-fad", "“Rajiv Menon Contemporary to open Los Angeles gallery”", "FAD Magazine", "2025-01-31", "https://fadmagazine.com/2025/01/31/rajiv-menon-contemporary-to-open-los-angeles-gallery/"),
    e("jml-sub", "Akanksha Kamath, “A moment with… painter Joya Mukerjee Logue”", "Akanksha Kamath (Substack)", "2026-05-29", "https://akankshakamath.substack.com/p/a-moment-with-painter-joya-mukerjee"),
  ],
  "artist-tiyana-mitchell": [
    e("tm-rca", "Tiyana Mitchell — Painting MA student profile", "Royal College of Art", "2025-01-01", "https://2025.rca.ac.uk/school-of-arts-humanities/painting-ma/profile/tiyana-mitchell/"),
  ],
  "artist-kubra-aliyeva": [
    e("ka-rb", "Self-Portrait Prize 2023 — selected artist, “Colours of the pain”", "Ruth Borchard Collection", "2023-01-01", "https://ruthborchard.org.uk/self-portrait-prize-2023/"),
  ],
  "artist-mengmeng-zhang": [
    e("mz-prestige", "Stephen Short, “China’s Rising Artists Taking Over London and the World”", "Prestige (Hong Kong)", "2025-07-25", "https://www.prestigeonline.com/hk/lifestyle/art-plus-design/chinas-rising-artists-taking-over-london-and-the-world/"),
  ],
  "artist-jessie-makinson": [
    e("jm-nyt", "Will Heinrich, “Art Fairs Come Blazing Back, Precarious but Defiant”", "The New York Times", "2021-09-09", "https://www.nytimes.com/2021/09/09/arts/design/armory-show-javits-center.html"),
    e("jm-artsy2", "“The 10 Best Booths at The Armory Show 2021”", "Artsy", "2021-09-10", "https://www.artsy.net/article/artsy-editorial-10-best-booths-armory-2021"),
    e("jm-av", "“Jessie Makinson at Galería OMR”", "Art Viewer", "2019-07-20", "https://artviewer.org/jessie-makinson-at-galeria-omr/"),
    e("jm-artnet4", "Sarah Cascone, “Editors’ Picks: 11 Things Not to Miss in the Virtual Art World This Week”", "Artnet News", "2020-03-30", "https://news.artnet.com/art-world/editorss-picks-10-things-not-to-miss-in-the-virtual-art-world-this-week-march-30-2020-1813197"),
    e("jm-fad", "Mark Westall, “The British Museum to present its first exhibition of emerging British artists”", "FAD Magazine", "2022-03-04", "https://fadmagazine.com/2022/03/04/the-british-museum-to-present-its-first-exhibition-of-emerging-british-artists/"),
  ],
  "artist-osman-yousefzada": [
    e("oy-ap2", "“Osman Yousefzada: A Home That Will Not Behave”", "Art Plugged", "2026-04-13", "https://artplugged.co.uk/osman-yousefzada-a-home-that-will-not-behave-bolanle-contemporary-no-9-cork-street/"),
    e("oy-10mag", "James Hughes, “Ten’s To See: ‘Osman Yousefzada: A Home That Will Not Behave’ at No. 9 Cork Street”", "10 Magazine", "2026-04-14", "https://10magazine.com/osman-yousefzada-a-home-will-not-behave-exhibition/"),
    e("oy-mj", "Simon Stephens, “The art of decolonisation”", "Museums Journal", "2025-02-13", "https://www.museumsassociation.org/museums-journal/features/2025/02/the-art-of-decolonisation/"),
    e("oy-kt", "Manmeet K Walia, “Osman Yousefzada’s latest exhibition interrogates colonial legacies”", "Khaleej Times", "2025-01-13", "https://www.khaleejtimes.com/lifestyle/arts/osman-yousefzadas-latest-exhibition-interrogates-colonial-legacies"),
    e("oy-forbes", "Lee Sharrock, “The Box Plymouth Presents Osman Yousefzada’s ‘When Will We Be Good Enough?’”", "Forbes", "2024-11-19", "https://www.forbes.com/sites/leesharrock/2024/11/19/the-box-plymouth-presents-osman-yousefzada-when-will-we-be-good-enough/"),
    e("oy-geo", "Victoria Heath, “Osman Yousefzada on the lingering arc of global power”", "Geographical", "2024-11-07", "https://geographical.co.uk/geopolitics/osman-yousefzada-on-the-lingering-arc-of-global-power"),
    e("oy-euro", "“Where It Began: Artist Osman Yousefzada kicks off countdown to Bradford UK City of Culture 2025”", "Euronews", "2024-05-09", "https://www.euronews.com/culture/2024/05/09/where-it-began-artist-osman-yousefzada-kicks-off-countdown-to-bradford-uk-city-of-culture-"),
    e("oy-tan2", "“‘From the margins to the forefront’: Osman Yousefzada wraps Queen Victoria statue in fabric for new show in Bradford”", "The Art Newspaper", "2024-05-07", "https://www.theartnewspaper.com/2024/05/07/from-the-margins-to-the-forefront-osman-yousefzada-wraps-queen-victoria-statue-in-fabric-for-new-show-in-bradford"),
    e("oy-si", "Cleo Roberts-Komireddi, “Osman Yousefzada — interview: ‘Opening doors for other people is key to what I do’”", "Studio International", "2023-01-23", "https://www.studiointernational.com/index.php/osman-yousefzada-interview-opening-doors-for-other-people-is-key-to-what-i-do"),
    e("oy-sculpt", "Rajesh Punj, “Looking Back To Go Forward: A Conversation with Osman Yousefzada”", "Sculpture Magazine", "2022-09-23", "https://sculpturemagazine.art/looking-back-to-go-forward-a-conversation-with-osman-yousefzada/"),
    e("oy-another", "Zara Afthab, “Osman Yousefzada’s Powerful New Show Delves Into the Migrant Experience”", "AnOther Magazine", "2022-07-29", "https://www.anothermag.com/art-photography/14255/osman-yousefzada-s-powerful-new-exhibition-explores-the-migrant-experience"),
    e("oy-tan3", "“That’s a wrap: artist Osman Yousefzada envelops Selfridges department store in a giant canvas”", "The Art Newspaper", "2021-07-30", "https://www.theartnewspaper.com/2021/07/30/thats-a-wrap-artist-osman-yousefzada-envelops-selfridges-department-store-in-a-giant-canvas"),
    e("oy-guard2", "“‘It can’t be ignored’: Osman Yousefzada on his gigantic artwork”", "The Guardian", "2021-07-26", "https://www.theguardian.com/artanddesign/2021/jul/26/it-cant-be-ignored-osman-yousefzada-on-hisgigantic-artwork"),
    e("oy-national", "“Selfridges unveils Osman Yousefzada art installation wrapped around store”", "The National", "2021-07-26", "https://www.thenationalnews.com/world/uk-news/2021/07/26/selfridges-unveils-osman-yousefzada-art-installation-wrapped-around-store/"),
  ],
};

// Fixes to entries that already exist.
const fixes = {
  "artist-mengmeng-zhang": {
    'press[_key=="pr0"].url': "https://issuu.com/artmazemag/docs/issue_30-31",
    'press[_key=="pr0"].date': "2023-03-02",
  },
  "artist-jessie-makinson": {
    'press[_key=="pr7"].url': "https://www.newyorker.com/goings-on-about-town/art/jessie-makinson-phumelele-tshabalala",
    'press[_key=="pr8"].url': "https://lylesandking.com/s/JessieMakinson_TheGuideArt-eewa.pdf",
    'press[_key=="pr18"].url': "https://lylesandking.com/s/Makinson-Art-Maze-Mag.pdf",
    'press[_key=="pr18"].title':
      "Zemtsova, Maria, “Subverting Patriarchal Myths: The Wilfully Feminist Work of Jessie Makinson”",
    'press[_key=="pr21"].url': "https://www.vanityfair.com/style/photos/2018/12/9-exciting-artists-from-miami-art-week-2018",
    // Author is Laura Snoad, not "Snoad, Lauren" — the Ghebaly CV has it wrong.
    'press[_key=="pr15"].title':
      "Laura Snoad, “Jessie Makinson on the intuitive process behind her fantastical paintings”",
  },
};

let added = 0;
for (const [id, entries] of Object.entries(additions)) {
  const current = await client.fetch(`*[_id == $id][0]{name, press}`, { id });
  const have = new Set((current.press || []).map((p) => p.url).filter(Boolean));
  const fresh = entries.filter((x) => !have.has(x.url));
  if (fresh.length === 0) {
    console.log(`${current.name}: nothing new to add`);
    continue;
  }
  const result = await client.patch(id).setIfMissing({ press: [] }).append("press", fresh).commit();
  added += fresh.length;
  console.log(`${current.name.padEnd(22)} +${String(fresh.length).padStart(2)} -> ${result.press.length} entries`);
}

for (const [id, set] of Object.entries(fixes)) {
  const result = await client.patch(id).set(set).commit();
  console.log(`fixed ${Object.keys(set).length} field(s) on ${result._id}`);
}

console.log(`\nDone: ${added} new press entries added.`);
