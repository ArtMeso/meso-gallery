import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import Image from "next/image";
import { imageDimensions, urlForImage } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 font-sans text-base font-light leading-relaxed text-ink/80 last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-serif text-2xl italic font-light text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-8 font-serif text-xl italic font-light text-ink">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l border-ink/20 pl-6 font-serif text-xl italic font-light text-ink/80">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="underline underline-offset-4 hover:text-ink"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer noopener"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const dims = imageDimensions(value);
      return (
        <div
          className="relative my-8 w-full overflow-hidden bg-card"
          style={{ aspectRatio: dims ? `${dims.width} / ${dims.height}` : "4 / 3" }}
        >
          <Image
            src={urlForImage(value).width(2000).quality(90).url()}
            alt={value.alt || ""}
            fill
            sizes="(min-width: 768px) 700px, 100vw"
            className="object-contain"
            quality={90}
          />
        </div>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-5 font-sans text-base font-light text-ink/80">
        {children}
      </ul>
    ),
  },
};

export function RichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
