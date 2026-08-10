import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";
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

  return (
    <div className="py-16">
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
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
              {team.map((member) => (
                <div key={member._id} className="flex gap-5">
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
                  <div>
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
            Advisory Philosophy
          </h2>
          <div className="mt-6 max-w-2xl space-y-6 font-sans text-sm font-light leading-relaxed text-ink/70">
            <p>
              We approach advisory the way we approach curation: with patience,
              context and an insistence on quality over noise. Every
              recommendation we make is grounded in the artist&rsquo;s
              practice, market position and long-term trajectory — never in
              short-term speculation.
            </p>
            <p>
              Whether you are acquiring your first work or building a
              considered collection over decades, our role is to bring
              clarity, access and independent judgement to every decision.
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
