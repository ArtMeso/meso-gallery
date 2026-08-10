import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { ArticleCard as ArticleCardType } from "@/sanity/types";
import { urlForImage } from "@/sanity/image";

export function ArticleCard({ article }: { article: ArticleCardType }) {
  return (
    <Link href={`/magazine/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-card">
        {article.featuredImage ? (
          <Image
            src={urlForImage(article.featuredImage).width(800).height(600).url()}
            alt={article.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-400 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="mt-4 space-y-1">
        <p className="eyebrow">{article.category}</p>
        <p className="font-serif italic text-xl font-light text-ink">
          {article.title}
        </p>
        <p className="font-sans text-xs font-light text-stone">
          {format(new Date(article.date), "d MMMM yyyy")}
        </p>
        {article.excerpt ? (
          <p className="font-sans text-sm font-light text-ink/70">
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
