import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mailtoHref } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

// Title and description target the queries this page already surfaces for in
// Search Console — "art acquisition consultancy", "investment art advisory",
// "private art investment consultant", "family office services for
// multi-generational art collectors" — rather than the generic "Art Advisory",
// which matched none of them and left most of the title slot unused.
export const metadata: Metadata = pageMetadata({
  title: "Art Investment Advisory & Acquisition Consultancy",
  description:
    "Art investment advisory for private collectors and family offices — acquisition strategy, valuation, provenance and private sales across London, Dubai and India.",
  path: "/art-advisory",
});

const services: {
  title: string;
  description: string;
  href?: string;
}[] = [
  {
    title: "Collection Building",
    description:
      "We work alongside collectors over the long term, developing a considered acquisition strategy shaped by your taste, budget and ambitions — from a first purchase to a museum-calibre collection.",
    href: "/collection-building",
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

const faqs: { question: string; answer: string; answerNode?: ReactNode }[] = [
  {
    question: "What does an art advisory service actually do?",
    answer:
      "We work as an independent, fee-based guide through every stage of buying art — sourcing works that fit your taste and budget, vetting authenticity and provenance, negotiating price, and managing shipping, insurance and installation. Our recommendations aren't tied to any auction house or single gallery's inventory.",
  },
  {
    question: "Do I need to already be a collector to work with you?",
    answer:
      "No. We work with first-time buyers furnishing a single room as often as we do with established collectors building a museum-calibre collection — the process simply scales to your ambitions and budget. If you're just starting out, our guide to starting an art collection is a good place to begin.",
    answerNode: (
      <>
        No. We work with first-time buyers furnishing a single room as often
        as we do with established collectors building a museum-calibre
        collection — the process simply scales to your ambitions and budget.
        If you&apos;re just starting out, our{" "}
        <Link
          href="/magazine/how-to-start-an-art-collection"
          className="underline underline-offset-4 hover:text-ink"
        >
          guide to starting an art collection
        </Link>{" "}
        is a good place to begin.
      </>
    ),
  },
  {
    question: "Can you help me choose art for my home or apartment, not just as an investment?",
    answer:
      "Yes — a large part of our advisory work is exactly this: selecting original contemporary pieces that suit a specific home, apartment or office, in the scale, palette and mood the space calls for, alongside any longer-term collecting goals you may have.",
  },
  {
    question: "Which cities and regions do you serve?",
    answer:
      "We're based in London and Dubai, and advise clients across the United Kingdom, the United Arab Emirates and India. Cross-border shipping, customs and installation are handled as part of the service.",
    answerNode: (
      <>
        We&apos;re based in London and Dubai, and advise clients across the
        United Kingdom, the United Arab Emirates and India. Cross-border
        shipping, customs and installation are handled as part of the service —
        our guide to{" "}
        <Link
          href="/tax-efficient-art-acquisition"
          className="underline underline-offset-4 hover:text-ink"
        >
          tax-efficient art acquisition
        </Link>{" "}
        sets out the questions worth settling before a work crosses a border.
      </>
    ),
  },
  {
    question: "How much does art advisory cost?",
    answer:
      "Fees depend on the scope — a single acquisition versus an ongoing collection-building mandate. We agree terms upfront before any work begins, and there is no cost to a first conversation.",
  },
  {
    question: "How do I get started?",
    answer:
      "Reach out via the enquiry button below or the contact page with a sense of what you're looking to build, invest in, or source, and we will respond directly to arrange a conversation.",
  },
];

export default function ArtAdvisoryPage() {
  const enquireHref = mailtoHref({
    subject: "Art Advisory enquiry",
    body: "Hello MeSo Ventures,\n\nI would like to discuss your art advisory services.\n\n",
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
                {service.href ? (
                  <Link href={service.href} className="hover:text-ink/70">
                    {service.title}
                  </Link>
                ) : (
                  service.title
                )}
              </h2>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-ink/70">
                {service.description}
              </p>
              {service.href ? (
                <p className="mt-3">
                  <Link
                    href={service.href}
                    className="font-sans text-sm font-light underline underline-offset-4 text-ink/70 hover:text-ink"
                  >
                    How we build collections
                  </Link>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Container>

      <Container className="mt-24 max-w-3xl border-t border-mist pt-16">
        <h2 className="font-serif text-2xl italic font-light text-ink">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-10">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-sans text-sm font-medium uppercase tracking-wide text-ink">
                {faq.question}
              </h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-ink/70">
                {faq.answerNode ?? faq.answer}
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
