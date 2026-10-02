import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";

// Set once the Google Form is created and published — see RSVP instructions.
// Format: https://docs.google.com/forms/d/e/{FORM_ID}/viewform?embedded=true
const RSVP_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdaJNTD9NKqmatUCnIKqDh6UvvFWnpyguQzPme-gd8KYsii6A/viewform?embedded=true";

const ARTISTS = [
  "Tiyana Mitchell",
  "Mary Pye",
  "Conor Murgatroyd",
  "Parnika Mittal",
  "Somya Satsangi",
];

export const metadata: Metadata = {
  ...pageMetadata({
    title: "The Inherited Surface — Private View",
    description:
      "RSVP for the opening of The Inherited Surface, a group exhibition by Tiyana Mitchell, Mary Pye, Conor Murgatroyd, Parnika Mittal and Somya Satsangi.",
    path: "/events/the-inherited-surface",
  }),
  // Private view invite — not for search engines.
  robots: { index: false, follow: false },
};

export default function TheInheritedSurfaceEventPage() {
  return (
    <div className="py-16">
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">Private View</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          The Inherited Surface
        </h1>
        <p className="mt-6 max-w-xl font-sans text-sm font-light leading-relaxed text-ink/70">
          A group exhibition featuring new work by Tiyana Mitchell, Mary Pye,
          Conor Murgatroyd, Parnika Mittal and Somya Satsangi. Join us for the
          opening evening.
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-mist pt-8 sm:grid-cols-2">
          <div>
            <dt className="eyebrow">Date &amp; Time</dt>
            <dd className="mt-2 font-sans text-sm font-light text-ink">
              To be confirmed
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Venue</dt>
            <dd className="mt-2 font-sans text-sm font-light text-ink">
              Address shared with confirmed guests closer to the date
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="eyebrow">Artists</dt>
            <dd className="mt-2 font-sans text-sm font-light text-ink">
              {ARTISTS.join(", ")}
            </dd>
          </div>
        </dl>

        <div className="mt-16 border-t border-mist pt-16">
          <p className="eyebrow mb-4">RSVP</p>
          {RSVP_FORM_EMBED_URL ? (
            <iframe
              src={RSVP_FORM_EMBED_URL}
              className="h-[1100px] w-full border-0"
              title="RSVP — The Inherited Surface"
            >
              Loading…
            </iframe>
          ) : (
            <p className="font-sans text-sm font-light text-ink/70">
              RSVP form coming soon.
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
