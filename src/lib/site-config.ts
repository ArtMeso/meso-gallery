export const siteConfig = {
  name: "MeSo Ventures",
  title: "MeSo Ventures — Contemporary Art Gallery & Advisory",
  description:
    "MeSo Ventures is an international contemporary art gallery and advisory platform based in London and Dubai, representing emerging and established artists and advising collectors across the UK, UAE and India on acquisition, investment and private sale.",
  // Apex, not www: the host redirects www -> apex (308), so canonical tags,
  // OG urls, sitemap entries and robots.txt must all name the apex or they
  // point Google at a URL that redirects away.
  url: "https://mesoventures.com",
  email: "art@mesoventures.com",
  instagram: "https://www.instagram.com/mesoventures",
  instagramHandle: "@mesoventures",
  // TODO: replace with the real WhatsApp business number, digits only, country code first
  whatsapp: "971XXXXXXXXX",
  // Physical locations — used for the footer and Organization.location in
  // structured data. Only include places with an actual presence here.
  locations: ["London", "Dubai"],
  // Markets served (advisory clients, exhibition history, artist network)
  // without claiming a physical office — used for Organization.areaServed
  // in structured data and general copy. Update if this changes.
  serviceAreas: ["United Kingdom", "United Arab Emirates", "India"],
  // Subjects the gallery and advisory are actually authoritative on. Feeds
  // Organization.knowsAbout, which is one of the few signals that tells a
  // search engine or a language model what this entity is *for*, rather than
  // just what it is called.
  expertise: [
    "Contemporary art",
    "Art advisory",
    "Art collection building",
    "Art investment",
    "South Asian art",
    "Indian Modern Masters",
    "Private art sales",
  ],
} as const;

// Named once here so the Organization markup, the Person markup on /about and
// any future author bylines all describe the same entity with the same strings.
// Inconsistent naming ("MeSo", "Meso Ventures Ltd", "Eirini") is what stops
// Google and language models from resolving these as single entities.
export const founder = {
  name: "Eirini Meze",
  jobTitle: "Founder & Director",
  // Only verified, first-party profiles belong in sameAs — a wrong URL here
  // actively harms entity resolution. Add LinkedIn/Frieze profiles once their
  // canonical URLs are confirmed.
  sameAs: ["https://www.faacii.org/"],
} as const;

export const navLinks = [
  { href: "/artists", label: "Artists" },
  { href: "/artworks", label: "Artworks" },
  { href: "/magazine", label: "MeSo Mag" },
  { href: "/art-advisory", label: "Art Advisory" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappHref(prefilledMessage?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return prefilledMessage
    ? `${base}?text=${encodeURIComponent(prefilledMessage)}`
    : base;
}

export function mailtoHref(options: {
  subject?: string;
  body?: string;
  to?: string;
}) {
  // mailto: is a URI, not a form submission — encodeURIComponent (%20 for
  // spaces) is correct here. URLSearchParams encodes spaces as "+", which
  // mail clients treat as a literal plus sign, not a space.
  const parts: string[] = [];
  if (options.subject) parts.push(`subject=${encodeURIComponent(options.subject)}`);
  if (options.body) parts.push(`body=${encodeURIComponent(options.body)}`);
  const query = parts.join("&");
  return `mailto:${options.to ?? siteConfig.email}${query ? `?${query}` : ""}`;
}
