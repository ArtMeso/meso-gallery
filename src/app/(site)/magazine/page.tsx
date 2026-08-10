import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ArticleCard } from "@/components/cards/article-card";
import { sanityFetch } from "@/sanity/fetch";
import { allArticlesQuery } from "@/sanity/queries";
import type { ArticleCard as ArticleCardType } from "@/sanity/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "MeSo Mag",
  description:
    "MeSo Mag — editorial coverage on the contemporary art market, artist spotlights, collecting guides, exhibition reviews and art fairs, from MeSo Ventures.",
  path: "/magazine",
});

export const revalidate = 120;

export default async function MagazinePage() {
  const articles = await sanityFetch<ArticleCardType[]>({ query: allArticlesQuery }).catch(
    () => []
  );

  return (
    <div className="py-16">
      <Container>
        <div className="mb-12">
          <p className="eyebrow mb-4">Editorial</p>
          <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
            MeSo Mag
          </h1>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState>New editorial coverage is on its way.</EmptyState>
        )}
      </Container>
    </div>
  );
}
