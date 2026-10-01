import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { founder, siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { teamMembersQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import type { TeamMember } from "@/sanity/types";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "MeSo Ventures is an international contemporary art gallery and advisory platform based in London and Dubai, advising collectors across the UAE and India. Learn our story, our team and our approach to advisory.",
  path: "/about",
});

export default async function AboutPage() {
  const team = await sanityFetch<TeamMember[]>({
    query: teamMembersQuery,
  }).catch(() => []);

  // Resolve the founder's own entry so the Person markup carries her real bio
  // and portrait rather than a second, hand-maintained copy of them. Matching
  // on the name in site-config keeps the two in step.
  const founderMember = team.find((member) => member.name === founder.name);

  const founderJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    // Same @id the Organization's `founder` property points at, so both
    // descriptions resolve to one entity instead of two similar-looking ones.
    "@id": `${siteConfig.url}/about#founder`,
    name: founder.name,
    jobTitle: founderMember?.role || founder.jobTitle,
    description: founderMember?.bio,
    image: founderMember?.portrait
      ? urlForImage(founderMember.portrait).width(600).height(600).url()
      : undefined,
    url: `${siteConfig.url}/about`,
    sameAs: [...founder.sameAs],
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    knowsAbout: [...siteConfig.expertise],
  };

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }}
      />
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">About</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          Our Story
        </h1>

        <div className="mt-10 space-y-6 font-sans text-base font-light leading-relaxed text-ink/80">
          <p>
            MeSo Ventures was founded to bridge two of the world&rsquo;s most
            dynamic art markets — London and Dubai — with a single, considered
            point of view. We represent a constellation of emerging and
            established contemporary artists, and advise collectors building
            meaningful, long-term collections across both regions, as well as
            the wider UAE and India.
          </p>
          <p>
            Our mission is straightforward: to give great artists a platform
            that matches the seriousness of their practice, and to give
            collectors the same rigour, discretion and market knowledge that
            institutional buyers expect — regardless of the size of their
            collection.
          </p>
        </div>

        <div className="mt-20 border-t border-mist pt-16">
          <h2 className="font-serif text-2xl italic font-light text-ink">
            Team
          </h2>
          {team.length > 0 ? (
            <div
              className={
                team.length > 1
                  ? "mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2"
                  : "mt-10 space-y-10"
              }
            >
              {team.map((member) => (
                <div key={member._id} className="flex gap-6">
                  {member.portrait ? (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-card">
                      <Image
                        src={urlForImage(member.portrait).width(200).height(200).url()}
                        alt={member.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg italic font-light text-ink">
                      {member.name}
                    </p>
                    {member.role ? (
                      <p className="mt-1 font-sans text-xs font-light uppercase tracking-widest text-stone">
                        {member.role}
                      </p>
                    ) : null}
                    {member.bio ? (
                      <p className="mt-3 font-sans text-sm font-light leading-relaxed text-ink/70">
                        {member.bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-xl font-sans text-sm font-light leading-relaxed text-stone">
              Founder and team profiles to be added — please supply names,
              bios and portraits for this section.
            </p>
          )}
        </div>

        <div className="mt-20 border-t border-mist pt-16">
          <h2 className="font-serif text-2xl italic font-light text-ink">
            Press &amp; Programme
          </h2>

          <div className="mt-8">
            <p className="font-sans text-xs font-light uppercase tracking-widest text-stone">
              Credentials
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-24 shrink-0">
                  <Image
                    src="/logos/frieze.png"
                    alt="Frieze"
                    fill
                    sizes="96px"
                    className="object-contain object-left"
                  />
                </div>
                <p className="font-sans text-xs font-light text-ink/70">
                  Global Ambassador,
                  <br />
                  Frieze Connect
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0">
                  <Image
                    src="/logos/faacii.png"
                    alt="FAACII"
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>
                <p className="font-sans text-xs font-light text-ink/70">
                  Chairwoman &amp; CEO,
                  <br />
                  FAACII
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-20 shrink-0">
                  <Image
                    src="/logos/amelie-daniel-linsey-foundation.png"
                    alt="Amelie & Daniel Linsey Foundation"
                    fill
                    sizes="80px"
                    className="object-contain object-left"
                  />
                </div>
                <p className="max-w-[14rem] font-sans text-xs font-light text-ink/70">
                  Former Board Member — fundraising balls at The Peninsula
                  London, auctions by Christie&rsquo;s
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="font-sans text-xs font-light uppercase tracking-widest text-stone">
              As Featured In
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="relative h-7 w-20 shrink-0">
                <Image
                  src="/logos/frieze.png"
                  alt="Frieze"
                  fill
                  sizes="80px"
                  className="object-contain object-left"
                />
              </div>
              <div className="relative h-9 w-20 shrink-0">
                <Image
                  src="/logos/mayfair-times.png"
                  alt="Mayfair Times"
                  fill
                  sizes="80px"
                  className="object-contain object-left"
                />
              </div>
              <div className="relative h-5 w-28 shrink-0">
                <Image
                  src="/logos/blowout-magazine.png"
                  alt="Blowout Magazine"
                  fill
                  sizes="112px"
                  className="object-contain object-left"
                />
              </div>
              <div className="relative h-7 w-16 shrink-0">
                <Image
                  src="/logos/mid-day.png"
                  alt="Mid-Day"
                  fill
                  sizes="64px"
                  className="object-contain object-left"
                />
              </div>
              <div className="relative h-6 w-24 shrink-0">
                <Image
                  src="/logos/impulse.png"
                  alt="Impulse"
                  fill
                  sizes="96px"
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-ink/70">
              &ldquo;Energetic, international, nonstop.&rdquo; —{" "}
              <a
                href="https://www.frieze.com/article/frieze-connect-member-spotlight-eirini-meze"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-ink"
              >
                Frieze Connect Member Spotlight: Eirini Meze
              </a>
              , July 2026
            </p>
          </div>

          <div className="mt-10">
            <p className="font-sans text-xs font-light uppercase tracking-widest text-stone">
              Frieze Connect — organised by Eirini
            </p>
            <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-card">
                  <Image
                    src="/events/priya-karani.jpg"
                    alt="Eirini Meze with Priya Karani and a guest at the New York private collection visit"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-sans text-xs font-light uppercase tracking-widest text-stone">
                  New York — September 2025
                </p>
                <a
                  href="https://www.frieze.com/event/new-york-private-collection-visit-priya-karani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-sans text-sm font-light text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  Private Collection Visit with Priya Karani
                </a>
                <p className="mt-1 font-sans text-xs font-light leading-relaxed text-ink/70">
                  Co-hosted with Frieze Connect, with works by Mary Pye, Xu
                  Yang and Alicja Kwade.
                </p>
              </div>
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-card">
                  <Image
                    src="/events/next-gen-collectors.jpg"
                    alt="No.9 Cork Street, London, venue for the Next Gen Collectors panel"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-sans text-xs font-light uppercase tracking-widest text-stone">
                  London — June 2026
                </p>
                <a
                  href="https://www.frieze.com/event/london-next-gen-collectors-how-become-insider-art-world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-sans text-sm font-light text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  Next Gen Collectors: How to Become an Insider
                </a>
                <p className="mt-1 font-sans text-xs font-light leading-relaxed text-ink/70">
                  Panel with Riccardo Freddo, Dr Ghadah W. Alharthi and Gigi
                  Surel.
                </p>
              </div>
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-card">
                  <Image
                    src="/events/summer-brunch.jpg"
                    alt="Guests at the Summer Brunch and private walkthrough of What Light Remains at the Bulgari London flagship"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-sans text-xs font-light uppercase tracking-widest text-stone">
                  London — June 2026
                </p>
                <Link
                  href="/magazine/meso-ventures-and-bulgari-present-what-light-remains-tiyana-mitchell"
                  className="mt-1 block font-sans text-sm font-light text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  Summer Brunch &amp; Private Walkthrough
                </Link>
                <p className="mt-1 font-sans text-xs font-light leading-relaxed text-ink/70">
                  What Light Remains by Tiyana Mitchell, at the Bulgari
                  London flagship.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="font-sans text-xs font-light uppercase tracking-widest text-stone">
              Exhibitions with Bulgari in London
            </p>
            <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-card">
                  <Image
                    src="https://cdn.sanity.io/images/jncu3emy/production/b12f321d7dbb5d3494e123d4fb66f008e1439c06-2268x4032.jpg?w=600&h=800&fit=crop&auto=format"
                    alt="Into the Future by Mary Pye at Bvlgari, London"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <a
                  href="https://www.blowoutmagazine.com/blowout-art/2025/6/27/bulgari-into-the-future-exhibition-london-with-mary-pye-hosted-meso-ventures"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block font-sans text-sm font-light text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  Into the Future
                </a>
                <p className="mt-1 font-sans text-xs font-light text-ink/70">
                  Mary Pye
                </p>
              </div>
              <div>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-card">
                  <Image
                    src="https://cdn.sanity.io/images/jncu3emy/production/1bfa30cc713178fadc172447ecd317c122a4d18c-3000x2955.jpg?w=600&h=800&fit=crop&auto=format"
                    alt="Tiyana Mitchell Bvlgari Exhibition 2026 What Light Remains"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <a
                  href="https://www.impulsemagazine.com/articles/tiyana-mitchell-what-light-remains-at-bulgari-and-meso-ventures"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block font-sans text-sm font-light text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  What Light Remains
                </a>
                <p className="mt-1 font-sans text-xs font-light text-ink/70">
                  Tiyana Mitchell
                </p>
              </div>
              <div>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-card">
                  <Image
                    src="https://cdn.sanity.io/images/jncu3emy/production/b80c93537541874ffc3dd9eddee85c1e6aae26eb-1365x2048.webp?w=600&h=800&fit=crop&auto=format"
                    alt="The Art of Colour by Lydia Hamblet at Bvlgari, London"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <Link
                  href="/magazine/meso-ventures-and-bulgari-the-art-of-colour-with-lydia-hamblet"
                  className="mt-3 block font-sans text-sm font-light text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  The Art of Colour
                </Link>
                <p className="mt-1 font-sans text-xs font-light text-ink/70">
                  Lydia Hamblet
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-mist pt-16">
          <h2 className="font-serif text-2xl italic font-light text-ink">
            Advisory Philosophy
          </h2>
          <div className="mt-6 space-y-6 font-sans text-sm font-light leading-relaxed text-ink/70">
            <p>
              We approach advisory the way we approach curation: with patience,
              context and an insistence on quality over noise. Every
              recommendation we make is grounded in the artist&rsquo;s
              practice, market position and long-term trajectory — never in
              short-term speculation.
            </p>
            <p>
              Whether you are acquiring your first work or{" "}
              <Link
                href="/collection-building"
                className="underline underline-offset-4 hover:text-ink"
              >
                building a considered collection
              </Link>{" "}
              over decades, our role is to bring clarity, access and
              independent judgement to every decision. Read more about our{" "}
              <Link
                href="/art-advisory"
                className="underline underline-offset-4 hover:text-ink"
              >
                art advisory services
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-20 border-t border-mist pt-10">
          <p className="font-sans text-sm font-light text-ink/70">
            {siteConfig.locations.join(" · ")} —{" "}
            <a href={`mailto:${siteConfig.email}`} className="hover:text-ink">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
}
