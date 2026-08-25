import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mailtoHref, siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

// This route existed before, was indexed at position 4.4 on 124 impressions and
// ranked position 1.0 for "meso ventures", then started returning 404 during the
// artist URL migration. Rebuilt at the same path so the existing links and index
// entry resolve rather than being redirected away.
//
// It deliberately targets "collection building" as a service in its own right —
// /art-advisory competes for "art investment advisory" and "acquisition
// consultancy", which are different intents. Keeping them on separate URLs
// avoids the two pages competing for either term.
export const metadata: Metadata = pageMetadata({
  title: "Art Collection Building for Collectors",
  description:
    "Build a contemporary art collection with a considered, long-term strategy — acquisition planning, artist research, budgeting and provenance, for collectors in London, Dubai and India.",
  path: "/collection-building",
});

const stages = [
  {
    step: "01",
    title: "Understanding what you want to build",
    description:
      "We start with conversation, not a shortlist. What draws you, what you already own, the spaces the work will live in, and whether you are building for pleasure, for legacy, or for both. A collection with a point of view is worth more — in every sense — than an assembly of individually good purchases.",
  },
  {
    step: "02",
    title: "Setting a budget that actually works",
    description:
      "A realistic annual acquisition budget matters more than the size of any single purchase. We help you decide whether to buy one significant work a year or several emerging pieces, and what each approach means for how the collection develops over five and ten years.",
  },
  {
    step: "03",
    title: "Research and access",
    description:
      "We identify artists whose practice fits your direction and whose market position we can defend — grounded in exhibition history, institutional standing and primary-market pricing. Our relationships with galleries, studios and estates reach works that never appear publicly.",
  },
  {
    step: "04",
    title: "Diligence before you commit",
    description:
      "Provenance, condition, authenticity and comparable pricing, checked before an offer is made. We negotiate on your behalf and tell you plainly when we think a work is wrong for you, or wrongly priced.",
  },
  {
    step: "05",
    title: "Care, records and what comes next",
    description:
      "Framing, installation, shipping, insurance valuations and a properly maintained inventory. Collections need custody as much as they need acquisitions, and a well-documented one is far easier to lend, place or pass on.",
  },
];

const faqs: { question: string; answer: string; answerNode?: ReactNode }[] = [
  {
    question: "What is art collection building?",
    answer:
      "Art collection building is the process of developing a collection with a deliberate direction over time, rather than buying works one at a time as they appear. It covers setting a budget and a focus, researching artists, vetting provenance and condition, negotiating acquisitions, and keeping proper records — so that the collection holds together as a body of work and retains its value.",
  },
  {
    question: "How is collection building different from art advisory?",
    answer:
      "Advisory covers any engagement where you need independent guidance — a single acquisition, a valuation, a private sale. Collection building is the long-term version of it: an ongoing mandate where we shape and grow a collection with you across years, not a single transaction.",
    answerNode: (
      <>
        <Link
          href="/art-advisory"
          className="underline underline-offset-4 hover:text-ink"
        >
          Advisory
        </Link>{" "}
        covers any engagement where you need independent guidance — a single
        acquisition, a valuation, a private sale. Collection building is the
        long-term version of it: an ongoing mandate where we shape and grow a
        collection with you across years, not a single transaction.
      </>
    ),
  },
  {
    question: "How much money do I need to start building a collection?",
    answer:
      "Less than most people assume. Serious works by emerging artists with real exhibition histories frequently sit between £1,000 and £5,000, and a considered collection can begin with one or two of them. What matters is consistency and judgement over time, not the size of the first cheque.",
    answerNode: (
      <>
        Less than most people assume. Serious works by emerging artists with
        real exhibition histories frequently sit between £1,000 and £5,000, and
        a considered collection can begin with one or two of them. What matters
        is consistency and judgement over time, not the size of the first
        cheque — our{" "}
        <Link
          href="/magazine/how-to-start-an-art-collection"
          className="underline underline-offset-4 hover:text-ink"
        >
          guide to starting an art collection
        </Link>{" "}
        walks through the first purchase in detail.
      </>
    ),
  },
  {
    question: "Do I have to buy from your gallery?",
    answer:
      "No. We represent artists and we also advise independently, and we are explicit about which hat we are wearing on any given work. A collection built only from one gallery's roster is not a collection built for you, and we will point you to works we do not represent whenever they are the better acquisition.",
  },
  {
    question: "How long does it take to build a collection?",
    answer:
      "A coherent collection takes years, and that is the point — the discipline of waiting for the right work is most of the value an advisor adds. Clients typically make between two and eight acquisitions a year with us, with research and viewings running continuously in between.",
  },
  {
    question: "Where do you work with collectors?",
    answer:
      "We are based in London and Dubai and build collections for clients across the United Kingdom, the United Arab Emirates and India, with particular depth in South Asian art and Indian Modern Masters. Cross-border shipping, customs, insurance and installation are handled as part of the mandate.",
  },
];

export default function CollectionBuildingPage() {
  const enquireHref = mailtoHref({
    subject: "Collection Building enquiry",
    body: "Hello MeSo Ventures,\n\nI would like to discuss building a collection.\n\n",
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  // Names the service itself, distinct from the Organization markup in the root
  // layout, so "collection building" resolves to a service MeSo Ventures offers
  // rather than only to the company.
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Art Collection Building",
    serviceType: "Art collection building and acquisition strategy",
    url: `${siteConfig.url}/collection-building`,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "Country",
      name: area,
    })),
  };

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Collection Building</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          Building a collection, not a set of purchases
        </h1>
        <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-ink/70">
          MeSo Ventures works with collectors over years rather than
          transactions — developing an acquisition strategy shaped by your
          taste, budget and ambitions, from a first purchase to a
          museum-calibre collection.
        </p>
      </Container>

      <Container className="mt-16 max-w-3xl">
        <div className="space-y-6 font-sans text-base font-light leading-relaxed text-ink/80">
          <p>
            Most collections begin by accident. A work bought on instinct at a
            fair, another from a friend&rsquo;s studio, a third because the wall
            needed something. There is nothing wrong with any of those
            purchases — but a collection built only that way rarely adds up to
            more than the sum of its parts, and it is far harder to place,
            insure, lend or pass on.
          </p>
          <p>
            Collection building is the discipline of deciding what you are
            actually assembling, and then acquiring against that decision with
            patience. It is the difference between owning art and holding a
            collection.
          </p>
        </div>
      </Container>

      <Container className="mt-24 max-w-3xl border-t border-mist pt-16">
        <h2 className="font-serif text-2xl italic font-light text-ink">
          How we build a collection with you
        </h2>
        <div className="mt-12 space-y-12">
          {stages.map((stage) => (
            <div key={stage.step} className="flex gap-6 sm:gap-10">
              <p className="shrink-0 font-serif text-2xl italic font-light text-stone">
                {stage.step}
              </p>
              <div>
                <h3 className="font-serif text-xl italic font-light text-ink">
                  {stage.title}
                </h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-ink/70">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="mt-24 max-w-3xl border-t border-mist pt-16">
        <h2 className="font-serif text-2xl italic font-light text-ink">
          Where to begin
        </h2>
        <div className="mt-6 space-y-6 font-sans text-sm font-light leading-relaxed text-ink/70">
          <p>
            If you are at the very start, our guide to{" "}
            <Link
              href="/magazine/how-to-start-an-art-collection"
              className="underline underline-offset-4 hover:text-ink"
            >
              starting an art collection
            </Link>{" "}
            covers the first purchase in practical detail — budgets, where to
            buy, and what to check before you commit. If you are weighing art
            against other assets,{" "}
            <Link
              href="/magazine/art-as-an-investment-2026-guide-for-collectors"
              className="underline underline-offset-4 hover:text-ink"
            >
              art as an investment
            </Link>{" "}
            sets out what the market actually returns.
          </p>
          <p>
            You can also browse the{" "}
            <Link
              href="/artists"
              className="underline underline-offset-4 hover:text-ink"
            >
              artists we represent
            </Link>{" "}
            and the{" "}
            <Link
              href="/artworks"
              className="underline underline-offset-4 hover:text-ink"
            >
              works currently available
            </Link>
            , or read about our wider{" "}
            <Link
              href="/art-advisory"
              className="underline underline-offset-4 hover:text-ink"
            >
              art advisory services
            </Link>
            .
          </p>
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
          Tell us what you already own and what you would like to build — we
          will respond directly.
        </p>
        <Button href={enquireHref} variant="solid" className="mt-8">
          Enquire about Collection Building
        </Button>
      </Container>
    </div>
  );
}
