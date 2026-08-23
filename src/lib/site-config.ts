export const siteConfig = {
  name: "MeSo Ventures",
  title: "MeSo Ventures — Contemporary Art Gallery & Advisory",
  description:
    "MeSo Ventures is an international contemporary art gallery and advisory platform based in London and Dubai, representing emerging and established artists and advising collectors across the UK, UAE and India on acquisition, investment and private sale.",
  url: "https://www.mesoventures.com",
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
