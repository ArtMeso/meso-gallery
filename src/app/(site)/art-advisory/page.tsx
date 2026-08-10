import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mailtoHref } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Art Advisory",
  description:
    "MeSo Ventures Art Advisory — Collection Building, Art Investment, Private Sales and Art Sourcing for collectors across London, Dubai, the wider UAE and India.",
  path: "/art-advisory",
});

const services = [
  {
    title: "Collection Building",
    description:
      "We work alongside collectors over the long term, developing a considered acquisition strategy shaped by your taste, budget and ambitions — from a first purchase to a museum-calibre collection.",
  },
  {
    title: "Art Investment",
    description:
      "Independent guidance on works with genuine market trajectory, grounded in provenance, exhibition history and an artist's institutional standing — not speculation.",
  },
  {
    title: "Private Sales",
    description:
      "Discreet, off-market placement and acquisition for collectors and estates who require confidentiality, careful timing and direct relationships with artists and galleries.",
  },
  {
    title: "Art Sourcing",
    description:
      "Access to specific works, artists or periods on request — drawing on our network across London, Dubai and beyond to locate pieces that rarely reach the open market.",
  },
];

export default function ArtAdvisoryPage() {
  const enquireHref = mailtoHref({
    subject: "Art Advisory enquiry",
    body: "Hello MeSo Ventures,\n\nI would like to discuss your art advisory services.\n\n",
  });

  return (
    <div className="py-16">
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Art Advisory</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          Considered guidance, for collectors at any stage
        </h1>
        <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-ink/70">
          MeSo Ventures advises private collectors, family offices and
          institutions in London, Dubai, across the wider UAE and in India —
          bringing gallery-level market knowledge to every acquisition.
        </p>
      </Container>

      <Container className="mt-16 max-w-3xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.title}>
              <h2 className="font-serif text-2xl italic font-light text-ink">
                {service.title}
              </h2>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-ink/70">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="mt-24 max-w-3xl border-t border-mist pt-16 text-center">
        <h2 className="font-serif text-2xl italic font-light text-ink">
          Start a conversation
        </h2>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm font-light text-ink/70">
          Tell us what you are looking to build, invest in, or source — we
          will respond directly.
        </p>
        <Button href={enquireHref} variant="solid" className="mt-8">
          Enquire about Advisory
        </Button>
      </Container>
    </div>
  );
}
