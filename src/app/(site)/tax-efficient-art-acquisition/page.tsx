import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mailtoHref, siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

// This URL was linked from six articles and indexed at position 6.9 while
// returning 404 — the page was referenced across the magazine but never
// actually built.
//
// Deliberately no figures, rates, thresholds or jurisdiction-specific claims:
// those change by country, by year and by the buyer's own circumstances, and
// stating them here would be both quickly wrong and advice we are not
// regulated to give. The page's job is to set out the questions worth
// answering before a cross-border purchase, and to send the reader to a
// qualified professional for the answers.
export const metadata: Metadata = pageMetadata({
  title: "Tax-Efficient Art Acquisition",
  description:
    "The questions worth answering before you buy art across borders — ownership, customs status, destination country and storage — and why each one is easier to settle before purchase than after.",
  path: "/tax-efficient-art-acquisition",
});

const questions: {
  step: string;
  title: string;
  body: ReactNode;
}[] = [
  {
    step: "01",
    title: "Who will ultimately own the work?",
    body: (
      <>
        <p>
          An individual, a company, a family trust, a foundation or a pension
          structure are not interchangeable buyers. The answer determines which
          rules apply to the purchase, how the work is treated while it is
          held, what happens if it is later sold or gifted, and who is
          responsible for declaring it.
        </p>
        <p className="mt-4">
          It is a question worth settling before an offer is made rather than
          at the invoicing stage. Changing the named buyer after a sale has
          been agreed is, at best, administratively awkward — and in some
          circumstances it is treated as a second transaction rather than a
          correction.
        </p>
      </>
    ),
  },
  {
    step: "02",
    title: "What customs status does the work currently hold?",
    body: (
      <>
        <p>
          A work that has already been formally imported and had all duties
          settled is in a different position from one sitting under a temporary
          arrangement, one still in bond, or one that has moved between
          jurisdictions on an exhibition or consignment basis. Two physically
          identical paintings can carry entirely different obligations
          depending on how each one arrived where it is.
        </p>
        <p className="mt-4">
          Ask the seller directly what status the work holds today, and ask for
          the documentation that evidences it. &ldquo;It has always been
          here&rdquo; is not a customs status.
        </p>
      </>
    ),
  },
  {
    step: "03",
    title: "Which country is it being imported into?",
    body: (
      <>
        <p>
          The destination governs what is due and when. Rules differ between
          jurisdictions on how art is classified, what reliefs may exist for
          certain categories of work, what documentation is required at the
          border, and how the value is established for assessment.
        </p>
        <p className="mt-4">
          If a work may move again — to a second home, to a lender, or to a
          future exhibition — it is worth understanding the position in each
          country involved rather than only the first one. A route that is
          straightforward in one direction is not automatically straightforward
          in reverse.
        </p>
      </>
    ),
  },
  {
    step: "04",
    title: "Is it going into storage, or into a home?",
    body: (
      <>
        <p>
          A work placed into a bonded facility or freeport is in a materially
          different position from one hung in a private residence. Storage
          under a customs-suspended arrangement and display in a home are
          treated differently, and moving a work from one to the other is an
          event with consequences — not simply a change of address.
        </p>
        <p className="mt-4">
          Decide what the work is actually for before it ships. A piece bought
          to live with and a piece bought to hold are best routed differently
          from the outset, and retrofitting the paperwork afterwards is the
          expensive way to do it.
        </p>
      </>
    ),
  },
  {
    step: "05",
    title: "Is all of this verified in writing?",
    body: (
      <>
        <p>
          Verbal assurance from a seller, a shipper or an intermediary is not
          documentation. Before funds move, you want an invoice naming the
          correct buying entity, a clear description of the work, and the
          customs and import paperwork that substantiates the status you have
          been told the work holds.
        </p>
        <p className="mt-4">
          This record matters well beyond the purchase. It is what supports the
          work&rsquo;s provenance, what an insurer will want, and what any
          future sale, loan or transfer will be assessed against.
        </p>
      </>
    ),
  },
];

const faqs: { question: string; answer: string; answerNode?: ReactNode }[] = [
  {
    question: "What does tax-efficient art acquisition actually mean?",
    answer:
      "It means settling the structural questions around a purchase — who owns the work, what customs status it holds, where it is going and how it will be held — before you buy rather than afterwards. It is not about avoiding what is due. It is about not creating avoidable cost or exposure through decisions made in the wrong order, which is what most commonly goes wrong on cross-border acquisitions.",
  },
  {
    question: "Why does it matter who is named as the buyer?",
    answer:
      "Because an individual, a company, a trust and a foundation are treated differently at every stage — purchase, holding, sale, gift and succession. The named buyer also determines who carries the declaration obligations. Changing it after a sale has been agreed can be treated as a fresh transaction rather than an administrative correction, so it is a question to settle before an offer goes in.",
  },
  {
    question: "What should I ask a seller before buying art from abroad?",
    answer:
      "Ask what customs status the work currently holds and for the documents that evidence it, whether duties and import charges have already been settled and in which jurisdiction, what the work's movement history is, and what paperwork will accompany it on export. Ask for all of it in writing before funds move.",
  },
  {
    question: "Does it matter whether a work goes into storage or into my home?",
    answer:
      "Yes, and it is one of the most commonly overlooked points. A work held in a bonded facility or freeport sits under a different arrangement from one displayed in a private residence, and moving between the two is a reportable event rather than a simple relocation. Deciding the work's destination before it ships is far simpler than changing it later.",
  },
  {
    question: "Do I need professional advice for this?",
    answer:
      "Yes. The rules vary by country, change over time, and depend on your own circumstances in ways no general guide can address — so treat this page as a list of questions to raise, not as answers. Take advice from a qualified tax adviser and, where the work is crossing a border, a customs specialist. We work alongside those advisers on the art side of the transaction.",
    answerNode: (
      <>
        Yes. The rules vary by country, change over time, and depend on your
        own circumstances in ways no general guide can address — so treat this
        page as a list of questions to raise, not as answers. Take advice from
        a qualified tax adviser and, where the work is crossing a border, a
        customs specialist. We work alongside those advisers on the art side of
        the transaction, as part of our{" "}
        <Link
          href="/art-advisory"
          className="underline underline-offset-4 hover:text-ink"
        >
          advisory service
        </Link>
        .
      </>
    ),
  },
];

export default function TaxEfficientArtAcquisitionPage() {
  const enquireHref = mailtoHref({
    subject: "Acquisition structure enquiry",
    body: "Hello MeSo Ventures,\n\nI would like to discuss an acquisition and how it should be structured.\n\n",
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tax-Efficient Art Acquisition: The Questions Worth Asking",
    description:
      "The questions worth answering before buying art across borders — ownership, customs status, destination country and storage.",
    author: { "@id": `${siteConfig.url}/#organization` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: `${siteConfig.url}/tax-efficient-art-acquisition`,
  };

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Collector Guide</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          Tax-efficient art acquisition
        </h1>
        <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-ink/70">
          Most of what makes a cross-border acquisition straightforward or
          painful is decided before the work ships. These are the questions
          worth answering first.
        </p>
      </Container>

      <Container className="mt-16 max-w-3xl">
        <div className="space-y-6 font-sans text-base font-light leading-relaxed text-ink/80">
          <p>
            When a work moves between countries, it stops being only an
            aesthetic decision and becomes an administrative one as well. Who is
            buying it, what status it already holds, where it is going and how
            it will be kept all carry consequences — and those consequences are
            far easier to shape before a purchase than to unpick afterwards.
          </p>
          <p>
            None of this is exotic or aggressive. It is ordinary diligence, of
            the kind any serious acquisition warrants. What follows is not
            advice and contains no figures, because the answers depend entirely
            on jurisdiction and on your own circumstances. It is a list of the
            questions we routinely raise with collectors, so that you can put
            them to the people qualified to answer them.
          </p>
        </div>
      </Container>

      <Container className="mt-24 max-w-3xl border-t border-mist pt-16">
        <h2 className="font-serif text-2xl italic font-light text-ink">
          Five questions to settle before you buy
        </h2>
        <div className="mt-12 space-y-14">
          {questions.map((q) => (
            <div key={q.step} className="flex gap-6 sm:gap-10">
              <p className="shrink-0 font-serif text-2xl italic font-light text-stone">
                {q.step}
              </p>
              <div>
                <h3 className="font-serif text-xl italic font-light text-ink">
                  {q.title}
                </h3>
                <div className="mt-3 font-sans text-sm font-light leading-relaxed text-ink/70">
                  {q.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="mt-24 max-w-3xl border-t border-mist pt-16">
        <h2 className="font-serif text-2xl italic font-light text-ink">
          Where this sits in a purchase
        </h2>
        <div className="mt-6 space-y-6 font-sans text-sm font-light leading-relaxed text-ink/70">
          <p>
            These questions belong at the point you are seriously considering a
            work, not at the point you are arranging shipping. By the time a
            crate is booked, most of the useful decisions have already been
            made — and the ones made by default are rarely the ones you would
            have chosen.
          </p>
          <p>
            If you are earlier than that, our guide to{" "}
            <Link
              href="/magazine/how-to-start-an-art-collection"
              className="underline underline-offset-4 hover:text-ink"
            >
              starting an art collection
            </Link>{" "}
            covers the fundamentals of a first purchase, and{" "}
            <Link
              href="/collection-building"
              className="underline underline-offset-4 hover:text-ink"
            >
              collection building
            </Link>{" "}
            sets out how we work with collectors over the longer term.
          </p>
        </div>
      </Container>

      <Container className="mt-24 max-w-3xl border-t border-mist pt-16">
        <h2 className="font-serif text-2xl italic font-light text-ink">
          Take professional advice
        </h2>
        <div className="mt-6 space-y-6 font-sans text-sm font-light leading-relaxed text-ink/70">
          <p>
            We are an art gallery and advisory, not tax advisers, and nothing on
            this page is tax, legal or financial advice. The treatment of art
            differs between jurisdictions, changes over time, and depends on
            circumstances specific to you.
          </p>
          <p>
            Before committing to a cross-border acquisition, take advice from a
            qualified tax adviser in the relevant jurisdiction and, where the
            work is crossing a border, from a customs or fine-art logistics
            specialist. We work alongside those advisers routinely, and can
            handle the art side — sourcing, diligence, valuation, condition and
            provenance — while they address the structure.
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
          Considering an acquisition?
        </h2>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm font-light text-ink/70">
          Tell us what you are looking at and where it would be going — we will
          respond directly, and flag what is worth raising with your advisers.
        </p>
        <Button href={enquireHref} variant="solid" className="mt-8">
          Enquire about an Acquisition
        </Button>
      </Container>
    </div>
  );
}
