import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cormorant, sans } from "@/lib/fonts";
import { founder, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  // Stable @id so the Person markup on /about, and any future Article author
  // or Service provider references, all point at this same node instead of
  // creating a fresh unnamed Organization on every page.
  "@id": `${siteConfig.url}/#organization`,
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.email,
  logo: `${siteConfig.url}/opengraph-image`,
  sameAs: [siteConfig.instagram],
  founder: {
    "@type": "Person",
    "@id": `${siteConfig.url}/about#founder`,
    name: founder.name,
    jobTitle: founder.jobTitle,
  },
  knowsAbout: [...siteConfig.expertise],
  location: siteConfig.locations.map((location) => ({
    "@type": "Place",
    name: location,
  })),
  // Markets we advise clients in, distinct from physical office locations
  // above — schema.org's correct property for "we serve here" without
  // claiming a presence there.
  areaServed: siteConfig.serviceAreas.map((area) => ({
    "@type": "Country",
    name: area,
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${sans.variable}`}>
      <body className="bg-cream font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      ) : null}
    </html>
  );
}
