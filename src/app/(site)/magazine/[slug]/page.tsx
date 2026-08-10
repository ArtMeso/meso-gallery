import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/portable-text";
import { sanityFetch } from "@/sanity/fetch";
import { articleBySlugQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import type { ArticleFull } from "@/sanity/types";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 120;

type Props = { params: { slug: string } };

async function getArticle(slug: string) {
  return sanityFetch<ArticleFull | null>({
    query: articleBySlugQuery,
    params: { slug },
  }).catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/magazine/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteConfig.url}/magazine/${article.slug}`,
      publishedTime: article.date,
      images: article.featuredImage
        ? [{ url: urlForImage(article.featuredImage).width(1200).height(630).url() }]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    author: { "@type": "Person", name: article.author || siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    image: article.featuredImage
      ? urlForImage(article.featuredImage).width(1200).height(630).url()
      : undefined,
    description: article.excerpt,
    mainEntityOfPage: `${siteConfig.url}/magazine/${article.slug}`,
  };

  return (
    <article className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="max-w-3xl">
        <p className="eyebrow mb-4">{article.category}</p>
        <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 font-sans text-sm font-light text-stone">
          {article.author ? `${article.author} — ` : ""}
          {format(new Date(article.date), "d MMMM yyyy")}
        </p>

        {article.featuredImage ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-card">
            <Image
              src={urlForImage(article.featuredImage).width(1600).height(900).url()}
              alt={article.title}
              fill
              sizes="(min-width: 768px) 700px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        {article.body ? (
          <div className="mt-10">
            <RichText value={article.body} />
          </div>
        ) : null}

        {article.relatedArtists && article.relatedArtists.length > 0 ? (
          <div className="mt-16 border-t border-mist pt-10">
            <p className="eyebrow mb-4">Related Artists</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {article.relatedArtists.map((a) => (
                <li key={a._id}>
                  <Link
                    href={`/artists/${a.slug}`}
                    className="font-serif italic text-lg font-light text-ink hover:text-ink/70"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
